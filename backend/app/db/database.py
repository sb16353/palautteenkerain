from sqlmodel import Session, create_engine, SQLModel
from pathlib import Path
import os

def read_secret(name):
    return Path(f"/run/secrets/{name}").read_text().strip()

db_user = read_secret("db_user")
db_password = read_secret("db_password")
db_name = read_secret("db_name")

db_host = os.getenv("DB_HOST", "db")
db_port = os.getenv("DB_PORT", "5432")

DATABASE_URL = f"postgresql+psycopg://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"

engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

