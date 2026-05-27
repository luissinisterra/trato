# AGENTS

## Architecture
- Entry point is `microservices/gateway-service` (NestJS, port 3000). The gateway routes by path: `/auth/*` → 3001, `/users/*` → 3002, `/auctions/*` → 3003, `/products/*` → 3004, `/bids/*` → 3005, `/payments/*` → 3006, `/reports/*` → 3007, `/notifications/*` → 3008, `/api/agents/*` → 3009.
- Auth routes (`/auth/register`, `/auth/login`, `/auth/refresh`) are public; everything else requires JWT. The gateway validates tokens by calling `POST /auth/validate` on the auth-service (no local JWT decoding).
- Notification flow is serverless: microservices → Cloudflare Worker (`POST /notify` + `x-notify-secret`) → Express notification-service (MongoDB). Frontend always hits notifications through the gateway (`NOTIFICATION_SERVICE_URL`), not the Worker.
- AI agent lives outside `microservices/` at `agent/ai-auction-advisor/` (FastAPI + Mirascope + Postgres). Gateway injects `x-user-id` header when proxying `/api/agents/chat` to FastAPI `POST /chat`.

## Run/Dev
- Local dev commands: `npm run start:dev` (NestJS gateway/auth), `npm run dev` (Express user/bid/notification), `./mvnw spring-boot:run` (auctions), `go run ./cmd/main.go` (product), `uvicorn src.app:app --port 3009` (AI agent).
- Full stack Docker: run `docker compose up --build` inside `microservices/gateway-service/`. This compose includes gateway + auth + user + auctions + bid + payment + report + product + notification + ai-agent + DBs + rabbitmq.
- Copy each service `.env.example` to `.env`; several `.env.example` ports conflict with gateway expectations (see gotchas).

## Gotchas
- Port mismatches in standalone Express services: `user-service` defaults to `PORT=3001` (app.js) but gateway expects 3002; `bid-service` defaults to `PORT=3000` but gateway expects 3005. Set the correct ports in `.env` when running locally.
- `microservices/bid-service/.env.example` says `PORT=3002` and `microservices/user-service/.env.example` says `PORT=3001`; both are wrong for gateway usage.
- `migrations/init.sql` only runs on first container init; if schema changes don’t apply, recreate the Docker volume.
- Auctions service requires Java 21; it reads `PORT` via `server.port=${PORT:3003}`.
- Go product service targets Go 1.26+ (`go.mod`).

## API Conventions
- Express services return `{ success: true/false, data: ... }` and validation errors as `{ success: false, errors: [...] }`.
- Gateway responses use `{ success, data, message }`.
- Auth-service uses NestJS ValidationPipe with `whitelist: true, forbidNonWhitelisted: true` (unknown DTO fields are rejected).

## References
- DB schemas for all services live in `doc/trato_microservices_db/`.
