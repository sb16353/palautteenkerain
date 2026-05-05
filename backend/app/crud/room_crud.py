from sqlmodel import Session, select
from db.models import Room, User
from fastapi import HTTPException
from crud.feedback_crud import get_room_stats

def get_room(session: Session, user: User, room_id: str) -> Room:
    room = session.get(Room, room_id)

    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    if room.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Room not owned by user")
    
    return room

def create_room(session: Session, user: User, room_id: str):

    try:
        if get_room(session, user, room_id):
            raise HTTPException(status_code=409, detail="Room already exists")
    except HTTPException as e:
        if e.status_code != 404:
            raise e

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
    get_room(session, user, room_id)
    return get_room_stats(session, room_id)

def get_rooms_from_user(session, user):
    return session.exec(select(Room).where(Room.owner_id == user.id)).all()

def delete_room(
    room_id: str,
    session: Session,
    user: User
):
    room = get_room(session, user, room_id)
    session.delete(room)
    session.commit()