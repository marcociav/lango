FROM python:3.9-buster

WORKDIR /lango-api-server

RUN pip install --upgrade pip

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .