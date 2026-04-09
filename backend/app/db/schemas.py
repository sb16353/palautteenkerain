from sqlmodel import Field
from db.models import RoomBase
from pydantic import BaseModel

class FeedbackCreate(BaseModel):
    room_id: str
    rating: int = Field(ge=1, le=5)
    comment: str

class FeedbackRead(FeedbackCreate):
    average: float
    count: int

class RoomIn(RoomBase):
    pass