from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import cv2
from tensorflow.keras.preprocessing.sequence import pad_sequences  # type: ignore
import pickle
from datetime import datetime
import os
import requests
from dotenv import load_dotenv

app = Flask(__name__)

# Load environment variables from .env (for local dev)
load_dotenv()

# Get Drive File IDs from environment
KERAS_FILE_ID = os.getenv("KERAS_FILE_ID")
PKL_FILE_ID = os.getenv("PKL_FILE_ID")

# Google Drive Direct Download URLs
MODEL_URL = f"https://drive.google.com/uc?export=download&id={KERAS_FILE_ID}"
TOKENIZER_URL = f"https://drive.google.com/uc?export=download&id={PKL_FILE_ID}"

# Function to download file if not present
def download_file_if_missing(url, filename):
    if not os.path.exists(filename):
        print(f"Downloading {filename}...")
        r = requests.get(url)
        if r.status_code == 200:
            with open(filename, "wb") as f:
                f.write(r.content)
            print(f"{filename} downloaded.")
        else:
            raise Exception(f"Failed to download {filename} from {url}")

# Ensure model and tokenizer are present
download_file_if_missing(MODEL_URL, "final_multimodal_model.keras")
download_file_if_missing(TOKENIZER_URL, "text_tokenizer.pkl")

# Load the Keras model and tokenizer
model = tf.keras.models.load_model("final_multimodal_model.keras")
with open("text_tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)

max_len = 100  # Same as during training

def preprocess_image(image_file):
    file_bytes = np.frombuffer(image_file.read(), np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
    img = cv2.resize(img, (224, 224)) / 255.0
    return np.expand_dims(img, axis=0)

def preprocess_text(text):
    seq = tokenizer.texts_to_sequences([text])
    return pad_sequences(seq, maxlen=max_len, padding="post")

@app.route("/predict", methods=["POST"])
def predict():
    file = request.files["file"]
    text = request.form.get("text", "")

    image_input = preprocess_image(file)
    text_input = preprocess_text(text)

    # Predict the artifact's creation year
    age_pred = model.predict([image_input, text_input])[0][0]
    current_year = datetime.now().year
    age = current_year - age_pred

    return jsonify({"age": f"{float(age):.2f}"})

if __name__ == "__main__":
    app.run(debug=True)
