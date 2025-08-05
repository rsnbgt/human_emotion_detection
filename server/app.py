from flask import Flask,request,jsonify
from flask_cors import CORS
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model
import numpy as np
import os
from waitress import serve

app=Flask(__name__)
CORS(app) # allow cross-origin requests from react

model_path = os.path.join(os.path.dirname(__file__), "facial_emotion_detection_model.h5")
model = load_model(model_path)

@app.route("/")
def home():
    return "Flask backend is running"

@app.route('/predict',methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error':'No file uploaded'}),400
    
    file=request.files['file']
    if file.filename=='':
        return jsonify({'error':'Empty filename'}),400
    
    file_path=os.path.join("temp.jpg")
    file.save(file_path)

    img=image.load_img(file_path,target_size=(48,48),color_mode='grayscale')
    img_array=image.img_to_array(img)
    img_array=np.expand_dims(img_array,axis=0)/255.0

    prediction=model.predict(img_array)
    predict_class=np.argmax(prediction,axis=1)[0]
    emotion_labels=['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']
    result=emotion_labels[predict_class]
    confidence=round(prediction[0][predict_class]*100,2)

    return jsonify({'prediction':result,'confidence':float(confidence)})


if __name__=="__main__":
    serve(app, host="0.0.0.0", port=8000)