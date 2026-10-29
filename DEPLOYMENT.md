# Deployment Guide

This guide covers production deployment with Docker Compose.

## 1. Prerequisites

- Docker Engine 24+
- Docker Compose v2+
- Open host ports:
  - `3001` for frontend
  - `8000` for backend API
  - `5432` for PostgreSQL (only if remote DB access is needed)

Check tools:

```powershell
docker --version
docker compose version
```

## 2. Prepare Server

Clone project and move into folder:

```powershell
git clone https://github.com/sb16353/palautteenkerain
cd palautteenkerain
```

Create secrets files in `secrets/`:

- `db_user.txt`
- `db_password.txt`
- `db_name.txt`
- `secret_key.txt`

Generate strong secret key example:

```powershell
[guid]::NewGuid().ToString("N") + [guid]::NewGuid().ToString("N")
```

## 3. Build and Start

Build images and start all services:

```powershell
docker compose up -d --build
```

Services:

- Frontend: `http://localhost:3001`
- Backend: `http://localhost:8000`
- Database: `localhost:5432`

## 4. Verify Deployment

Check container status:

```powershell
docker compose ps
```

Check logs:

```powershell
docker compose logs --tail 100
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

Quick API check:

```powershell
curl http://localhost:8000/docs
```

## 5. Operations

Restart services:

```powershell
docker compose restart
```

Stop services:

```powershell
docker compose down
```

Stop and remove volumes (deletes DB data):

```powershell
docker compose down -v
```

Update to latest code:

```powershell
git pull
docker compose up -d --build
```

## 6. Database Backup and Restore

Backup:

```powershell
docker compose exec -T db pg_dump -U "$(Get-Content .\secrets\db_user.txt)" "$(Get-Content .\secrets\db_name.txt)" > backup.sql
```

Restore:

```powershell
Get-Content backup.sql | docker compose exec -T db psql -U "$(Get-Content .\secrets\db_user.txt)" "$(Get-Content .\secrets\db_name.txt)"
```

## 7. Production Hardening Checklist

- Do not expose port `5432` to internet unless required.
- Restrict firewall rules to trusted IPs.
- Keep `secrets/` out of version control.
- Rotate database credentials and `secret_key` regularly.
- Use HTTPS with reverse proxy (for example nginx, Traefik, or cloud load balancer) in front of frontend/backend.
- Add monitoring and alerting for container restarts and high resource usage.

## 8. Troubleshooting

Port already in use:

- Change host-side port in `docker-compose.yml`.
- Restart stack:

```powershell
docker compose up -d
```

Container fails to start:

```powershell
docker compose ps
docker compose logs --tail 200 <service-name>
```

Database connection retries in backend logs:

- Wait until PostgreSQL is ready.
- Recheck secrets values and file names.
- Confirm `DB_HOST=db` and `DB_PORT=5432`.

## 9. Linux Deployment (Ubuntu/Debian)

Install Docker and Compose plugin:

https://docs.docker.com/engine/install/

Allow non-root Docker usage:

```bash
sudo usermod -aG docker $USER
newgrp docker
```

Deploy app:

```bash
git clone <your-repo-url> palautteenkerain
cd palautteenkerain
docker compose up -d --build
docker compose ps
```

Enable start on reboot:

```bash
sudo systemctl enable docker
docker compose up -d
```

## 10. Reverse Proxy (HTTPS)

Goal: expose app on standard web ports while containers keep internal ports.

### 10.1 Nginx on host

Install nginx and certbot:

```bash
sudo apt-get update
sudo apt-get install -y nginx certbot python3-certbot-nginx
```

Create site config `/etc/nginx/sites-available/palautteenkerain`:

```nginx
server {
    listen 80;
    server_name your-domain.example;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable config and TLS:

```bash
sudo ln -s /etc/nginx/sites-available/palautteenkerain /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d your-domain.example
```

### 10.2 Traefik in Docker (alternative)

Use when you prefer proxy managed in containers. Add Traefik service and labels for frontend/backend. Minimal sample:

```yaml
services:
  traefik:
    image: traefik:v3.1
    command:
      - --providers.docker=true
      - --providers.docker.exposedbydefault=false
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro

  frontend:
    labels:
      - traefik.enable=true
      - traefik.http.routers.frontend.rule=Host(`your-domain.example`)
      - traefik.http.routers.frontend.entrypoints=web
      - traefik.http.services.frontend.loadbalancer.server.port=80

  backend:
    labels:
      - traefik.enable=true
      - traefik.http.routers.backend.rule=Host(`your-domain.example`) && PathPrefix(`/api`)
      - traefik.http.routers.backend.entrypoints=web
      - traefik.http.middlewares.backend-strip.stripprefix.prefixes=/api
      - traefik.http.routers.backend.middlewares=backend-strip
      - traefik.http.services.backend.loadbalancer.server.port=8000
```

Notes:

- If reverse proxy handles public traffic, keep app ports firewalled to localhost/private network.
- For Traefik automatic TLS, add ACME resolver settings and persistent cert storage.
