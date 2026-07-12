# Docker Setup

This project can run on a shared server over an IP address without taking port 80 or using `container_name`.

## Files

- `docker-compose.ip.yml` is the IP-safe compose file.
- `.env.docker.example` is the template for host and API settings.

## Setup

1. Copy `.env.docker.example` to `.env.docker`.
2. Set `NEXT_PUBLIC_API_ORIGIN` to the backend API address.
3. Pick a free host port in `HOST_PORT` if `3001` is already used.
4. Run:

```bash
docker compose -f docker-compose.ip.yml --env-file .env.docker -p tourism-app-ip up -d --build
```

## Notes

- The container listens on internal port `3000`.
- The app is exposed on the host as `http://SERVER_IP:HOST_PORT`.
- IP mode disables subdomain routing and uses path-based tenant URLs such as `/_sites/{tenant}`.
