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

models_dir = 'models-live'

storage_client = storage.Client()
bucket = storage_client.get_bucket('lango-model')
blobs = bucket.list_blobs(prefix=models_dir + '/')  # Get list of files

for blob in blobs:
    filepath = blob.name
    parent_path = filepath.split('/')
    filename = parent_path.pop()

    parent_path = '/'.join(parent_path)  # Create subfolders if they don't exist
    Path(f'./{parent_path}').mkdir(parents=True, exist_ok=True)
    if filename != '':
        blob.download_to_filename(filepath)

cpu = '/CPU:0'
maxlen = 140
v = 'v2'

with device(cpu):
    lango_model = load_model(f'{models_dir}/lango_model_{v}')

with open(f'{models_dir}/utils/tokenizer_{v}.pickle', 'rb') as f:
    tokenizer = pickle.load(f)

with open(f'{models_dir}/utils/num_to_lan.json') as f:
    num_to_lan = json.load(f)

with open(f'{models_dir}/utils/lan_to_language.json') as f:
    lan_to_language = json.load(f)

with open('.version') as f:
    version = f.read()

app = FastAPI(
    name='Lango API',
    version=version
)

origins = ["*"]

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
def lango(sentence: Sentence) -> Predictions:
    sentence = sentence.dict()
    # maybe log request body here

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
    predictions = dict((lan_to_language[lan], conf) for lan, conf in predictions.items())  # certain lan map to lan

    predictions = [{"language": lan, "confidence": conf} for lan, conf in predictions.items()]
    predictions = sorted(predictions, key=itemgetter("confidence"), reverse=True)
    # maybe log response body here

    predictions = Predictions.parse_obj(predictions)
    return predictions


if __name__ == '__main__':
    log_config = uvicorn.config.LOGGING_CONFIG
    log_config["formatters"]["access"]["fmt"] = "%(asctime)s - %(levelname)s - %(message)s"
    log_config["formatters"]["default"]["fmt"] = "%(asctime)s - %(levelname)s - %(message)s"
    uvicorn.run(app, host='0.0.0.0', port=8080, log_config=log_config)
