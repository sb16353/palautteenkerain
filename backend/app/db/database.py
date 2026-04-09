from sqlmodel import Session, create_engine, SQLModel, text
from sqlalchemy.exc import OperationalError
from d_secrets import read_secret
import os
import time

db_user = read_secret("db_user")
db_password = read_secret("db_password")
db_name = read_secret("db_name")

db_host = os.getenv("DB_HOST", "db")
db_port = os.getenv("DB_PORT", "5432")

DATABASE_URL = f"postgresql+psycopg://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"

engine = create_engine(DATABASE_URL, echo=True)

def wait_for_db(max_retries=10, delay=2):
    """Wait until the database is ready."""
    for attempt in range(1, max_retries + 1):
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            print("Database is ready")
            return
        except OperationalError:
            print(f"DB not ready (attempt {attempt}/{max_retries})...")
            time.sleep(delay)

    raise RuntimeError("Database is not available after retries")


def create_db_and_tables():
    wait_for_db()
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session