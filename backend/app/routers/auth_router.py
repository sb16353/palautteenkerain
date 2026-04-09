from fastapi import APIRouter, Depends
from sqlmodel import Session
from crud import auth_crud
from db.database import get_session
from pydantic import BaseModel

class AuthRequest(BaseModel):
    username: str
    password: str

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
def register(data: AuthRequest, session: Session = Depends(get_session)):
    return auth_crud.register(data.username, data.password, session)


@router.post("/login")
def login(data: AuthRequest, session: Session = Depends(get_session)):
    return auth_crud.login(data.username, data.password, session)