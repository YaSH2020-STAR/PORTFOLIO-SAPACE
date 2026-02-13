from flask import Flask, request, jsonify
from sklearn.cluster import KMeans
import numpy as np
from googletrans import Translator
import speech_recognition as sr
from sklearn.neighbors import NearestNeighbors
import pandas as pd
from sklearn.linear_model import LinearRegression

app = Flask(__name__)

# AI-Driven Learning Paths
@app.route('/learning-path', methods=['POST'])
def learning_path():
    user_data = np.array(request.json['user_data'])
    kmeans = KMeans(n_clusters=2)
    kmeans.fit(user_data)
    user_groups = kmeans.predict(user_data)
    learning_paths = {0: "Beginner Path", 1: "Advanced Path"}
    return jsonify([learning_paths[g] for g in user_groups])

# Course Recommendation
@app.route('/recommend', methods=['POST'])
def recommend():
    courses = np.array([[1, 0, 0], [0, 1, 0], [0, 0, 1]])
    user_interests = np.array(request.json['interests'])
    nn = NearestNeighbors(n_neighbors=1).fit(courses)
    _, recommendation = nn.kneighbors([user_interests])
    recommended_course = ['Math', 'Science', 'History'][recommendation[0][0]]
    return jsonify({"recommended_course": recommended_course})

# Video Translation
@app.route('/translate', methods=['POST'])
def translate():
    translator = Translator()
    text = request.json['text']
    lang = request.json['lang']
    translated = translator.translate(text, dest=lang)
    return jsonify({"translated_text": translated.text})

# Speech Recognition
@app.route('/speech-to-text', methods=['POST'])
def speech_to_text():
    audio_file = request.files['file']
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_file) as source:
        audio = recognizer.record(source)
    text = recognizer.recognize_google(audio)
    return jsonify({"text": text})

# Data Collection & Optimization
@app.route('/optimal-study-time', methods=['POST'])
def optimal_study_time():
    data = request.json['data']
    df = pd.DataFrame(data)
    model = LinearRegression()
    model.fit(df[['time_spent']], df['scores'])
    target_score = request.json['target_score']
    optimal_time = (target_score - model.intercept_) / model.coef_[0]
    return jsonify({"optimal_time": optimal_time.tolist()})

if __name__ == '__main__':
    app.run(debug=True)
