
// 2️⃣ API Route (route.ts - Handles file upload & sends request to Flask API)
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("file") as File;
    const text = formData.get("text") as string;

    if (!image) return NextResponse.json({ error: "No image uploaded" }, { status: 400 });

    // Forward data to Flask backend
    const backendResponse = await axios.post("http://127.0.0.1:5000/predict", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return NextResponse.json({ age: backendResponse.data.age });
  } catch (error) {
    console.error("Prediction failed:", error);
    return NextResponse.json({ error: "Prediction error" }, { status: 500 });
  }
}
