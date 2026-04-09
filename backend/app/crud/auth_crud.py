from login.hash import hash_password, verify_password
from login.user import create_access_token
from sqlmodel import Session, select
from db.models import User
from fastapi import HTTPException

def register(username: str, password: str, session: Session):
    
    user = session.exec(select(User).where(User.username == username)).first()

    if user:
        raise HTTPException(status_code=400, detail="User already exists")

    if len(username.strip()) < 2:
        raise HTTPException(status_code=400, detail="Username should be atleast 2 characters long")
    
    if len(password.strip()) < 5:
        raise HTTPException(status_code=400, detail="Password should be atleast 5 characters long")
    
    user = User(
        username=username,
        password_hash=hash_password(password)
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    return {"token": create_access_token(user.id)}

def login(username: str, password: str, session: Session):
    user = session.exec(select(User).where(User.username == username)).first()

    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"token": create_access_token(user.id)}