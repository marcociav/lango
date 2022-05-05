from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

import pickle
import json

import numpy as np
from tensorflow import device
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences

from operator import itemgetter

from schemas import Sentence, Predictions

from dotenv import load_dotenv
from pathlib import Path
from google.cloud import storage


load_dotenv()

storage_client = storage.Client()
bucket = storage_client.get_bucket('lango-model')
blobs = bucket.list_blobs(prefix='models/')  # Get list of files

Path('./models/').mkdir(parents=True, exist_ok=True)
for blob in blobs:
    filename = blob.name.replace('/', '_')
    blob.download_to_filename('models/' + filename)  # Download

cpu = '/CPU:0'
maxlen = 280

with device(cpu):
    lango_model = load_model('models/lango_model_v1')

with open('models/utils/tokenizer_v1.pickle', 'rb') as f:
    tokenizer = pickle.load(f)

with open('models/utils/num_to_lan.json') as f:
    num_to_lan = json.load(f)

app = FastAPI(
    name='Lango API'
)

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://marcociav.github.io/"
    "http://marcociav.githu.io/lango"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/')
def home():
    return {
        "data": "This is the Lango API"
    }


@app.post('/lango')
def lango(sentence: Sentence):
    sentence = sentence.dict()
    sentence = sentence["text"]
    sentence = [sentence]
    sentence = np.asarray(sentence)

    sequence = tokenizer.texts_to_sequences(sentence)
    sequence = pad_sequences(sequence, padding='post', maxlen=maxlen, truncating='post')

    with device(cpu):
        predictions = lango_model.predict(sequence)
    predictions = list(predictions[0])

    predictions = {int(num): float(conf) for num, conf in enumerate(predictions)}
    predictions = dict((num_to_lan[str(num)], conf) for num, conf in predictions.items())  # str must be removed
    predictions = [
        {"language": lan, "confidence": conf}
        for lan, conf in predictions.items()
    ]
    predictions = sorted(predictions, key=itemgetter("confidence"), reverse=True)

    predictions = Predictions.parse_obj(predictions)
    return predictions


if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=5000)
