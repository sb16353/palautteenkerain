import bcrypt

def hash_password(password: str) -> str:
    password_bytes = password.encode("utf-8")
    hashed = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
    return hashed.decode("utf-8")

def verify_password(password: str, hashed: str) -> bool:
    password_bytes = password.encode("utf-8")
    hashed_bytes = hashed.encode("utf-8")  
    return bcrypt.checkpw(password_bytes, hashed_bytes)

import hashlib

def make_user_hash(user_identifier: str) -> str:
    return hashlib.sha256(user_identifier.encode()).hexdigest()