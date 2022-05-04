from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

import pickle  # need to import tokenizer (to be saved in model training)
from tensorflow import device
from tensorflow.keras.models import load_model


with device('/CPU:0'):
    lango_model = load_model('models/lango_model_v1')

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

class Sentence(BaseModel):
    text: str


@app.get('/')
def home():
    return {
        "data": "This is the Lango API"
    }


@app.post('/lango')
def lango(sentence: Sentence):
    sentence = sentence.dict()
    sentence = sentence["text"]
    # paused until tokenizer is ready


if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=5000)
