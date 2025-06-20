"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Session fetch error:", error.message);
        return;
      }

      if (session) {
        router.push("/upload");
      } else {
        router.push("/auth");
      }
    };

    checkSession();
  }, [router]);

  return (
    <div className="container" style={{ textAlign: "center" }}>
      <h2 className="header">🔐 Authenticating...</h2>
      <p
        style={{
          fontFamily: "Cormorant Garamond, serif",
          fontSize: "18px",
          color: "#5a3d2b",
        }}
      >
        Hold on as we verify your credentials.
      </p>
    </div>
  );
}
