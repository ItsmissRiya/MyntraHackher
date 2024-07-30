from flask import Flask, request, jsonify
import pickle
import numpy as np
from numpy.linalg import norm
import os
from sklearn.neighbors import NearestNeighbors
import pandas as pd
import tensorflow as tf
import keras
import cv2
import sys
sys.stdout.reconfigure(encoding='utf-8')
from flask_cors import CORS
app = Flask(__name__)
CORS(app)


# Load the model and data
feature_list = np.array(pickle.load(open('C:\\Users\\Riya Jaiswal\\React-apps\\Myntra\\AI\\embeddings_new.pkl', 'rb')))
filenames = pickle.load(open('C:\\Users\\Riya Jaiswal\\React-apps\\Myntra\\AI\\filenames_new.pkl', 'rb'))
csv_data = pd.read_csv('C:\\Users\\Riya Jaiswal\\React-apps\\Myntra\\AI\\Myntra_Data\\Fashion Dataset v2.csv')

base_model = keras.applications.ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
base_model.trainable = False

model = tf.keras.Sequential([
    base_model,
    keras.layers.GlobalMaxPooling2D()
])

neighbors = NearestNeighbors(n_neighbors=5, algorithm='auto', metric='cosine')
neighbors.fit(feature_list)

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return "No file part in the request", 400

    file = request.files['file']
    if file.filename == '':
        return "No selected file", 400

    img_path = './temp.jpg'
    file.save(img_path)

    # Preprocess the image
    img = keras.preprocessing.image.load_img(img_path, target_size=(224, 224))
    img_array = keras.preprocessing.image.img_to_array(img)
    expanded_img_array = np.expand_dims(img_array, axis=0)
    preprocessed_img = keras.applications.resnet.preprocess_input(expanded_img_array)
    result = model.predict(preprocessed_img).flatten()
    normalized_result = result / norm(result)

    distances, indices = neighbors.kneighbors([normalized_result])

    result_pid_img = {}
    for file_index in indices[0]:
        filename = filenames[file_index]
        product_id = os.path.basename(filename).split('.')[0]
        req_row = csv_data.loc[csv_data['p_id'] == int(product_id)]
        result_img = req_row['img'].values[0]
        result_pid_img[product_id] = result_img

    return jsonify(result_pid_img)


if __name__ == '__main__':
    app.run(debug=True)