from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import cv2
from tensorflow.keras.preprocessing.sequence import pad_sequences # type: ignore
import pickle
from datetime import datetime

app = Flask(__name__)

# Load Model
model = tf.keras.models.load_model("final_multimodal_model.keras")
with open("text_tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)

max_len = 100  # Same as training

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

    # Make prediction
    age_pred = model.predict([image_input, text_input])[0][0]
    current_year = datetime.now().year
    age=current_year - age_pred

    
    return jsonify({"age": f"{float(age):.2f}"})

if __name__ == "__main__":
    app.run(debug=True)
