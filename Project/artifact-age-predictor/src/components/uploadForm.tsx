"use client";

import { useSession } from "@supabase/auth-helpers-react";
import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const UploadForm = () => {
  const session = useSession();
  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      setError("Please upload an image.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", image);
    formData.append("text", text);

    try {
      const { data } = await axios.post("/api/predict", formData);
      setPrediction(parseFloat(data.age).toFixed(2) as unknown as number);
    } catch (error) {
      console.error("Prediction error", error);
      setError("Failed to get prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!session) return <p>Please log in to access prediction features.</p>;

  return (
    <motion.div
      className="container"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="header">📜 Artifact Age Predictor</h2>

      <label className="file-upload">
        Select Image
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </label>

      {image && (
        <img
          src={URL.createObjectURL(image)}
          alt="Preview"
          className="image-preview"
        />
      )}

      <textarea
        placeholder="Enter historical notes (optional)"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="input-field"
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Predicting..." : "Predict Age"}
      </button>

      {error && <p className="error">{error}</p>}

      {prediction && (
        <center>
          <p className="results">🏺 Predicted Age: {prediction} years</p>
        </center>
      )}
    </motion.div>
  );
};

export default UploadForm;
