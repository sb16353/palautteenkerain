import hashlib

def get_user_hash(identifier: str) -> str:
    return hashlib.sha256(identifier.encode()).hexdigest()