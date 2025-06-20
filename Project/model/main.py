from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
import cv2
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pickle
from datetime import datetime
import os
import gdown
from dotenv import load_dotenv

# Initialize app
app = FastAPI()

# Allow CORS if needed (optional)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Set your frontend origin here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load env
load_dotenv()

KERAS_FILE_ID = os.getenv("KERAS_FILE_ID")
PKL_FILE_ID = os.getenv("PKL_FILE_ID")

model = None
tokenizer = None
max_len = 100

# Utility: download from GDrive
def download_if_missing(file_id, filename):
    if not os.path.exists(filename):
        print(f"Downloading {filename}...")
        url = f"https://drive.google.com/uc?id={file_id}"
        gdown.download(url, filename, quiet=False)

# Preprocessing
def preprocess_image(file: UploadFile):
    img_bytes = np.frombuffer(file.file.read(), np.uint8)
    img = cv2.imdecode(img_bytes, cv2.IMREAD_COLOR)
    img = cv2.resize(img, (224, 224)) / 255.0
    return np.expand_dims(img, axis=0)

def preprocess_text(text: str):
    sequence = tokenizer.texts_to_sequences([text])
    return pad_sequences(sequence, maxlen=max_len, padding="post")

# Load model/tokenizer on startup
@app.on_event("startup")
def load_assets():
    global model, tokenizer
    download_if_missing(KERAS_FILE_ID, "final_multimodal_model.keras")
    download_if_missing(PKL_FILE_ID, "text_tokenizer.pkl")
    print("Loading model and tokenizer...")
    model = tf.keras.models.load_model("final_multimodal_model.keras")
    with open("text_tokenizer.pkl", "rb") as f:
        tokenizer = pickle.load(f)
    print("Model loaded!")

# Root endpoint
@app.get("/")
async def root():
    return {"status": "FastAPI is running!"}

# Prediction endpoint
@app.post("/predict")
async def predict(file: UploadFile, text: str = Form(...)):
    try:
        img = preprocess_image(file)
        txt = preprocess_text(text)
        prediction = model.predict([img, txt])[0][0]
        age = datetime.now().year - prediction
        return {"age": f"{float(age):.2f}"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})