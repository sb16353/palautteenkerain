from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

feedback = []

class Feedback(BaseModel):
    event_id: int
    rating: int
    comment: str

@app.post("/feedback")
def submit_feedback(f: Feedback):
    feedback.append(f)
    return {"status": "ok"}

@app.get("/feedback")
def get_feedback():
    return feedback