from sqlmodel import Session, select
from datetime import datetime, timedelta, timezone
from db.models import Feedback, Room
from fastapi import HTTPException

UPDATE_COOLDOWN = timedelta(minutes=1)

def get_feedback(session: Session, room_id: str, user_hash: str):
    return session.exec(
        select(Feedback)
        .where(Feedback.room_id == room_id)
        .where(Feedback.user_hash == user_hash)
    ).first()

def room_exists(session: Session, room_id: str) -> bool:
    if session.exec(select(Room).where(Room.id == room_id)).first():
        return True
    return False

def create_or_update_feedback(session: Session, room_id: str, user_hash: str, rating: int, comment: str):
    feedback = get_feedback(session, room_id, user_hash)
    now = datetime.now(timezone.utc)

    if not room_exists(session, room_id):
        raise HTTPException(status_code=404, detail="Room not found")

    if feedback:
        if now - feedback.updated_at.replace(tzinfo=timezone.utc) < UPDATE_COOLDOWN:
            raise ValueError("You can only update your rating once per minute")

        feedback.rating = rating
        feedback.comment = comment
        feedback.updated_at = now
    else:
        feedback = Feedback(
            room_id=room_id,
            user_hash=user_hash,
            rating=rating,
            comment=comment,
            created_at=now,
            updated_at=now,
        )
        session.add(feedback)

    session.commit()
    session.refresh(feedback)
    return feedback


def get_room_stats(session: Session, room_id: str):
    feedback = session.exec(select(Feedback).where(Feedback.room_id == room_id)).all()

    if not feedback:
        return 0.0, 0, []
    
    results = [x.rating for x in feedback]
    comments = [(x.rating, x.comment) for x in feedback]

    avg = sum(results) / len(results)
    return avg, len(results), comments