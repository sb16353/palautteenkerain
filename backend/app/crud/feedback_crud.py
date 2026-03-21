from sqlmodel import Session, select
from datetime import datetime, timedelta, timezone
from db.models import Feedback, Room

UPDATE_COOLDOWN = timedelta(minutes=1)

def get_feedback(session: Session, room_id: str, user_hash: str):
    return session.exec(
        select(Feedback)
        .where(Feedback.room_id == room_id)
        .where(Feedback.user_hash == user_hash)
    ).first()

def create_or_update_feedback(session: Session, room_id: str, user_hash: str, rating: int):
    feedback = get_feedback(session, room_id, user_hash)
    now = datetime.now(timezone.utc)

    room = session.exec(select(Room).where(Room.id == room_id)).first()
    if not room:
        room = Room(id=room_id)
        session.add(room)
        session.commit()
        session.refresh(room)

    if feedback:
        if now - feedback.updated_at.replace(tzinfo=timezone.utc) < UPDATE_COOLDOWN:
            raise ValueError("You can only update your rating once per minute")

        feedback.rating = rating
        feedback.updated_at = now
    else:
        feedback = Feedback(
            room_id=room_id,
            user_hash=user_hash,
            rating=rating,
            created_at=now,
            updated_at=now,
        )
        session.add(feedback)

    session.commit()
    session.refresh(feedback)
    return feedback


def get_room_stats(session: Session, room_id: str):
    results = session.exec(
        select(Feedback.rating).where(Feedback.room_id == room_id)
    ).all()

    if not results:
        return 0.0, 0

    avg = sum(results) / len(results)
    return avg, len(results)