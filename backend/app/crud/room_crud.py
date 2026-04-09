from sqlmodel import Session, select
from db.models import Room, User
from fastapi import HTTPException
from crud.feedback_crud import get_room_stats

def create_room(session: Session, user: User, room_id: str):
    room = Room(
        id = room_id,
        owner=user,
    )

    session.add(room)
    session.commit()
    session.refresh(room)

    return room

def get_room_feedback(
    room_id: str,
    session: Session,
    user: User
):
    room = session.get(Room, room_id)

    if not room or room.owner_id != user.id:
        raise HTTPException(status_code=403)

    return get_room_stats(session, room_id)

def get_rooms_from_user(session, user):
    return session.exec(select(Room).where(Room.owner_id == user.id)).all()