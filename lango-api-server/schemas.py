from pydantic import BaseModel
from typing import List


class Sentence(BaseModel):
    text: str


class Prediction(BaseModel):
    language: str
    confidence: float


class Predictions(BaseModel):
    __root__: List[Prediction]