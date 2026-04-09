from fastapi import APIRouter, Depends, Request, HTTPException, status
from sqlmodel import Session

from db.schemas import FeedbackCreate, FeedbackRead
from db.database import get_session
import crud.feedback_crud as crud
from login.hash import make_user_hash

router = APIRouter(prefix="/feedback", tags=["feedback"])

@router.post("", response_model=FeedbackRead)
def submit_feedback(
    data: FeedbackCreate,
    request: Request,
    session: Session = Depends(get_session),
):
    identifier = request.client.host + request.headers.get("user-agent", "")
    user_hash = make_user_hash(identifier)

    try:
        crud.create_or_update_feedback(session, data.room_id, user_hash, data.rating, data.comment)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=str(e))

    avg, count = crud.get_room_stats(session, data.room_id)

    return FeedbackRead(
        room_id=data.room_id,
        rating=data.rating,
        comment=data.comment,
        average=avg,
        count=count,
    )

@router.get("")
def room_exists(room_id: str, session: Session = Depends(get_session)):
    return crud.room_exists(session, room_id)