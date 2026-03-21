from fastapi import APIRouter, Depends, Request, HTTPException, status
from sqlmodel import Session

from db.models import Room
from db.schemas import FeedbackCreate, FeedbackRead
from db.database import get_session
from crud.feedback_crud import create_or_update_feedback, get_room_stats
from utils import get_user_hash

router = APIRouter(prefix="/feedback", tags=["feedback"])

@router.post("/", response_model=FeedbackRead)
def submit_feedback(
    data: FeedbackCreate,
    request: Request,
    session: Session = Depends(get_session),
):
    identifier = request.client.host + request.headers.get("user-agent", "")
    user_hash = get_user_hash(identifier)

    try:
        create_or_update_feedback(session, data.room_id, user_hash, data.rating)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=str(e))

    avg, count = get_room_stats(session, data.room_id)

    return FeedbackRead(
        room_id=data.room_id,
        rating=data.rating,
        average=avg,
        count=count,
    )


@router.get("/{room_id}", response_model=FeedbackRead)
def get_feedback_stats(
    room_id: str,
    session: Session = Depends(get_session),
):
    avg, count = get_room_stats(session, room_id)

    return FeedbackRead(
        room_id=room_id,
        rating=0,  # not user-specific here
        average=avg,
        count=count,
    )