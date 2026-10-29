# palautteenkerain

A web based system for gathering feedback on a simple 1-5 scale utilizing a React frontend, a FastAPI backend and a PostgreSQL database for storing feedback data.

## Production

Full deployment runbook: [DEPLOYMENT.md](DEPLOYMENT.md)

Run stack with:

```powershell
docker compose up -d --build
```

Ports:
- Backend: http://localhost:8000
- Frontend: http://localhost:3001