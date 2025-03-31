// 1️⃣ UploadForm.tsx (Frontend - React Component for Uploading Files & Text)
"use client";
import { useState } from "react";
import axios from "axios";

const UploadForm = () => {
  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [prediction, setPrediction] = useState<number | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImage(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return alert("Please upload an image");

    const formData = new FormData();
    formData.append("file", image);
    formData.append("text", text);

    try {
      const { data } = await axios.post("/api/predict", formData);
      setPrediction(data.age);
    } catch (error) {
      console.error("Prediction error", error);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-2">Upload Artifact</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <textarea 
        placeholder="Enter historical notes (optional)" 
        value={text} 
        onChange={(e) => setText(e.target.value)}
        className="w-full border p-2 mt-2"
      />
      <button 
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-lg"
      >
        Predict Age
      </button>
      {prediction && <p className="mt-2 text-lg font-semibold">Predicted Age: {prediction} years</p>}
    </div>
  );
};

export default UploadForm;