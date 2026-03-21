from sqlmodel import SQLModel, Field

class FeedbackCreate(SQLModel):
    room_id: str
    rating: int = Field(ge=1, le=5)


class FeedbackRead(SQLModel):
    room_id: str
    rating: int
    average: float
    count: int