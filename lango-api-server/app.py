from fastapi import FastAPI


app = FastAPI(
    name='Lango API'
)



@app.get('/')
def home():
    return {
        "data": "This is the Lango API"
    }