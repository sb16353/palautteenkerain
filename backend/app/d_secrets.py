from pathlib import Path

def read_secret(name):
    return Path(f"/run/secrets/{name}").read_text().strip()