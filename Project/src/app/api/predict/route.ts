import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const image = formData.get("file");
    const text = formData.get("text") as string;

    if (!(image instanceof File)) {
      return NextResponse.json(
        { error: "Invalid image file" },
        { status: 400 },
      );
    }

    // Upload to Supabase Storage
    const arrayBuffer = await image.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const fileExt = image.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;
    const filePath = `${session.user.id}/${fileName}`;

    const { data: storageData, error: uploadError } = await supabase.storage
      .from("artifacts")
      .upload(filePath, buffer, {
        contentType: image.type,
      });

    if (uploadError) {
      console.error("Storage Upload Error:", uploadError);
      return NextResponse.json(
        { error: "Image upload failed" },
        { status: 500 },
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("artifacts").getPublicUrl(filePath);

    // Predict using backend
    const uploadForm = new FormData();
    uploadForm.append("file", image);
    uploadForm.append("text", String(text || " "));

    const backendResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/predict`,
      uploadForm,
      {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      },
    );

    const age = (parseFloat(backendResponse.data.age) * 100) / 100;

    // Insert log
    const { error: insertError } = await supabase
      .from("artifact_predictions")
      .insert([
        {
          user_email: session.user.email,
          username:
            session.user.user_metadata?.username ||
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            "Anonymous",
          notes: text && text.trim() ? text : null,
          prediction: age,
          image_url: publicUrl,
          user_id: session.user.id,
        },
      ]);

    if (insertError) {
      console.error("Supabase Insert Error:", insertError);
    }

    return NextResponse.json({ age });
  } catch (error) {
    console.error("[Prediction Error]", error);
    return NextResponse.json({ error: "Prediction error" }, { status: 500 });
  }
}
