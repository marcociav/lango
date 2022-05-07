FROM python:3.9-slim-buster

WORKDIR /lango-api-server

RUN pip3 install --upgrade pip

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

CMD python3 ./app.py