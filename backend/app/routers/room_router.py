from fastapi import APIRouter, Depends
from sqlmodel import Session
from db.models import User, Room, Feedback
from db.database import get_session
import crud.room_crud as crud
from login.user import get_current_user

router = APIRouter(prefix="/rooms", tags=["rooms"])

@router.post("/{room_id}", response_model=Room, status_code=201)
def create_room(
    room_id: str,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    return crud.create_room(session, user, room_id)

@router.get("", response_model=list[Room])
def get_rooms(
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    return crud.get_rooms_from_user(session, user)

@router.get("/{room_id}", response_model=list[Feedback])
def get_feedback(
    room_id: str,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    return crud.get_room_feedback(room_id, session, user)

@router.delete("/{room_id}", status_code=204)
def delete_room(
    room_id: str,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    return crud.delete_room(room_id, session, user)