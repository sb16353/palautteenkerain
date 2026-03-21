from sqlmodel import SQLModel, Field, UniqueConstraint
from sqlalchemy import Column, TIMESTAMP
from typing import Optional
from datetime import datetime, timezone

class Room(SQLModel, table=True):
    id: str = Field(primary_key=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Feedback(SQLModel, table=True):
    __table_args__ = (
        UniqueConstraint("room_id", "user_hash"),
    )

    id: Optional[int] = Field(default=None, primary_key=True)

    room_id: str = Field(foreign_key="room.id")

    user_hash: str = Field(index=True)

    rating: int = Field(ge=1, le=5)

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(TIMESTAMP(timezone=True))
    )
    
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(TIMESTAMP(timezone=True))
    )