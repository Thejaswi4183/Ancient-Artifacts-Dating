# 🏛️ Ancient Artifact Age Predictor

A full-stack web app that predicts the age of ancient artifacts (like coins, sculptures, inscriptions) using a trained ML model. The app features GitHub/email-based login via Supabase, FastAPI backend for inference, and a parchment-inspired aesthetic.

---

## 🌐 Live Demo

**Frontend:** https://artifact-age-predictor.vercel.app/auth  
**Backend API:** https://fastapi-app-production-a3db.up.railway.app/

---

## ✨ Features

- 📸 Upload ancient artifact images
- 🧠 ML-powered age prediction
- 🔐 Login with GitHub or Email (Supabase)
- 🧾 View your previous predictions
- 🪶 Themed parchment-style UI
- 📜 Full name display from GitHub/email metadata
- 🪙 FastAPI for prediction endpoint

---

## 🧩 Tech Stack

| Layer        | Technology                          |
|--------------|--------------------------------------|
| Frontend     | Next.js, React, Framer Motion, CSS   |
| Authentication | Supabase Auth (GitHub & Email)      |
| Backend      | Python, FastAPI, Uvicorn, Pydantic   |
| ML Model     | PyTorch/TensorFlow (your trained model) |
| Database     | Supabase PostgreSQL (user & logs)    |
| Hosting      | Vercel (frontend) + Render/VM (backend) |

---

## 🚀 Getting Started

### 🖥️ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

⚙️ Backend Setup (FastAPI)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
Make sure your main.py exposes a POST /predict route that accepts images and returns age.

---

🔐 Supabase Configuration

Create a Supabase project

Enable GitHub and Email auth

Add redirect URL: http://localhost:3000/upload

Create users and artifacts tables to store metadata

---

🔮 Prediction API Format

Endpoint: POST /predict

Body: Form-data with image file

Response:
```bash
{
  "predicted_age": 1247.58
}

```

---

🧾 Logs

Logs are stored in the artifacts table

Includes: username, image_url, prediction, timestamp

---
🧠 Model Info

You can plug in any custom image-based artifact dating model (CNN, ResNet, etc.) inside the FastAPI backend. Ensure proper preprocessing and return the predicted value with 2 decimal precision.

---

