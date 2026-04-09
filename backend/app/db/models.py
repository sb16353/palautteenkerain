from sqlmodel import SQLModel, Field, UniqueConstraint, Relationship
from sqlalchemy import Column, TIMESTAMP
from typing import Optional, List
from datetime import datetime, timezone

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    password_hash: str

    rooms: List["Room"] = Relationship(back_populates="owner")

class RoomBase(SQLModel):
    id: str = Field(primary_key=True)

class Room(RoomBase, table=True):
    owner_id: int = Field(foreign_key="user.id")
    owner: Optional[User] = Relationship(back_populates="rooms")

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(TIMESTAMP(timezone=True))
    )

class Feedback(SQLModel, table=True):
    __table_args__ = (
        UniqueConstraint("room_id", "user_hash"),
    )

    id: Optional[int] = Field(default=None, primary_key=True)

    room_id: str = Field(foreign_key="room.id")

    user_hash: str = Field(index=True)

    comment: str = Field(index=True)

    rating: int = Field(ge=1, le=5)

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(TIMESTAMP(timezone=True))
    )
    
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(TIMESTAMP(timezone=True))
    )