import pickle
import tensorflow
import keras
import numpy as np
from numpy.linalg import norm
import os
# from tensorflow.keras.preprocessing import image
# from tensorflow.keras.layers import GlobalMaxPooling2D
# from tensorflow.keras.applications.resnet50 import ResNet50,preprocess_input
from sklearn.neighbors import NearestNeighbors
import cv2

os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

feature_list = np.array(pickle.load(open('embeddings_new.pkl','rb')))
filenames = pickle.load(open('filenames_new.pkl','rb'))

model = keras.applications.ResNet50(weights='imagenet',include_top=False,input_shape=(224,224,3))
model.trainable = False

model = tensorflow.keras.Sequential([
    model,
    keras.layers.GlobalMaxPooling2D()
])

# print(model.summary())
img =keras.preprocessing.image.load_img('Myntra_Data/Images_new/11244988.jpg',target_size=(224,224))
img_array = keras.preprocessing.image.img_to_array(img)
expanded_img_array = np.expand_dims(img_array, axis=0)
preprocessed_img = keras.applications.resnet.preprocess_input(expanded_img_array)
result = model.predict(preprocessed_img).flatten()
normalized_result = result / norm(result)

input_img = cv2.imread('Myntra_Data/Images_new/11244988.jpg')
cv2.imshow('Input Image', cv2.resize(input_img, (512, 512)))
cv2.waitKey(0)


neighbors = NearestNeighbors(n_neighbors=5,algorithm='auto',metric='cosine')
neighbors.fit(feature_list)

distances,indices = neighbors.kneighbors([normalized_result])

print(indices)

for file in indices[0][1:6]:
    temp_img = cv2.imread(filenames[file])
    cv2.imshow('Output',cv2.resize(temp_img,(512,512)))
    cv2.waitKey(0)
