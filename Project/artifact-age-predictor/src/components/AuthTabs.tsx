"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaUser, FaLock, FaEnvelope, FaUserPlus } from "react-icons/fa";

const Toastify = require("toastify-js");
import "toastify-js/src/toastify.css";

export default function AuthTabs() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      Toastify({
        text: error.message,
        duration: 3000,
        close: false,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
    } else {
      router.push("/upload");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const fullName = form.fullname.value;
    const email = form.email.value;
    const password = form.password.value;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username: fullName },
      },
    });

    if (error) {
      setError(error.message);
      Toastify({
        text: error.message,
        duration: 3000,
        close: false,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
    } else {
      Toastify({
        text: "Check your email to confirm your registration.",
        duration: 3000,
        close: false,
        gravity: "top",
        position: "center",
        backgroundColor: "#4CAF50",
      }).showToast();
      setIsLogin(true);
    }
  };

  const handleGitHubLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: "http://localhost:3000/upload",
        queryParams: { prompt: "login" },
      },
    });

    if (error) {
      setError(error.message);
      Toastify({
        text: error.message,
        duration: 3000,
        close: false,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
      }).showToast();
    }
  };

  return (
    <div className="auth-tabs">
      <div className="tab-buttons">
        <button
          className={`tab ${isLogin ? "active" : ""}`}
          onClick={() => setIsLogin(true)}
        >
          <FaUser /> Login
        </button>
        <button
          className={`tab ${!isLogin ? "active" : ""}`}
          onClick={() => setIsLogin(false)}
        >
          <FaUserPlus /> Register
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isLogin ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.3 }}
          >
            <form className="form" onSubmit={handleLogin}>
              <div className="input-group">
                <FaEnvelope />
                <input type="email" name="email" placeholder="Email" required />
              </div>
              <div className="input-group">
                <FaLock />
                <input type="password" name="password" placeholder="Password" required />
              </div>
              <button type="submit">🔐 SIGN IN</button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="register"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <form className="form" onSubmit={handleRegister}>
              <div className="input-group">
                <FaUser />
                <input type="text" name="fullname" placeholder="Full Name" required />
              </div>
              <div className="input-group">
                <FaEnvelope />
                <input type="email" name="email" placeholder="Email" required />
              </div>
              <div className="input-group">
                <FaLock />
                <input type="password" name="password" placeholder="Password" required />
              </div>
              <button type="submit">📜 Register</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="divider"></div>
      <h2><center>OR</center></h2>

      <button onClick={handleGitHubLogin} className="github-button">
        <FaGithub /> Sign in with GitHub
      </button>
    </div>
  );
}
