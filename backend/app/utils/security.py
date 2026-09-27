import hashlib
import os

def get_password_hash(password: str) -> str:
    """Hashes password using PBKDF2-HMAC-SHA256 for cross-platform Python 3.14 stability."""
    salt = b"frictionflow_salt_2026"
    pwd_bytes = password.encode('utf-8')
    derived = hashlib.pbkdf2_hmac('sha256', pwd_bytes, salt, 100000)
    return derived.hex()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return get_password_hash(plain_password) == hashed_password
