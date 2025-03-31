"use client";
import { useState } from "react";
import axios from "axios";

const UploadForm = () => {
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
      setPrediction(data.age);
    } catch (error) {
      console.error("Prediction error", error);
      setError("Failed to get prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="header">📜 Artifact Age Predictor</h2>

      <label className="file-upload">
        Select Image
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </label>
      {image && <p className="text-sm mt-2 text-green-600">{image.name}</p>}

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
      {prediction && <p className="results">🏺 Predicted Age: {prediction} years</p>}
    </div>
  );
};

export default UploadForm;
