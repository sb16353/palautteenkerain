from fastapi import APIRouter, Depends
from sqlmodel import Session
from db.models import User
from db.database import get_session
import crud.room_crud as crud
from login.user import get_current_user

router = APIRouter(prefix="/rooms", tags=["rooms"])

@router.post("")
def create_room(
    room_id: str,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    return crud.create_room(session, user, room_id)

@router.get("")
def get_rooms(
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    return crud.get_rooms_from_user(session, user)

@router.get("/{room_id}")
def get_feedback(
    room_id: str,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    return crud.get_room_feedback(room_id, session, user)