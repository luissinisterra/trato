# AGENTS

## Architecture Overview
- **Entry point**: `microservices/gateway-service` on port 3000 (NestJS). All client requests go through here.
- Gateway forwards by path: `/auth/*` → 3001, `/users/*` → 3002, `/auctions/*` → 3003, `/products/*` → 3004, `/bids/*` → 3005, `/payments/*` → 3006, `/reports/*` → 3007, `/notifications/*` → 3008.
- **Notification architecture**: Microservicios → Cloudflare Worker (validate + forward) → Express notification-service → MongoDB. Frontend consulta notificaciones a través del gateway → Express notification-service.
- Auth routes (`/auth/register`, `/auth/login`, `/auth/refresh`) are public. All other routes require JWT — the gateway validates tokens by calling `POST /auth/validate` on the auth-service (no local JWT decoding).
- Frontend: Angular 21 + TailwindCSS 4 at `frontend/trato-front/` (port 4200).

## Services and Ports
| Service | Port | Stack | DB Port (host) |
|---------|------|-------|----------------|
| gateway-service | 3000 | NestJS | — |
| auth-service | 3001 | NestJS + TypeORM + pg | 5435 |
| user-service | 3002 | Express + pg | 5432 |
| auctions-service | 3003 | Spring Boot (Java 21) + JPA | 5434 |
| product-service | 3004 | Go + Gin + pg | 5436 |
| bid-service | 3005 | Express + pg | 5433 |
| notification-service | 3008 | Express + Mongoose (MongoDB) | 27017 |
| ai-agent-service | 3009 | Python + FastAPI + Mirascope + PG | 5437 |
| payment-service | 3006 | (not implemented) | — |
| report-service | 3007 | (not implemented) | — |

## Getting Started
- Copy `.env.example` → `.env` for each service before running. No services ship with `.env` committed.
- All microservices are under `microservices/`. The root `auctions-service/` dir is a build artifact only (`target/`); ignore it.
- Standalone ports in `.env.example` sometimes conflict with gateway expectations. Set them as shown above when running outside Docker.

## Commands
- **Gateway/Auth** (NestJS): `cd microservices/<service> && npm run start:dev`
- **User/Bid** (Express): `cd microservices/<service> && npm run dev`
- **Auctions** (Spring Boot): `cd microservices/auctions-service && ./mvnw spring-boot:run`
- **Product** (Go): `cd microservices/product-service && go run ./cmd/main.go`
- **Notification** (Express + Mongoose): `cd microservices/notification-service && npm run dev`
- **AI Agent** (Python): `cd agent/ai-auction-advisor && source .venv/bin/activate && uvicorn src.app:app --port 3009`
- **Frontend** (Angular): `cd frontend/trato-front && npm start` (port 4200)
- **Full orchestration**: `docker compose up --build` inside `microservices/gateway-service/` (starts gateway, auth, auctions, bid, notification + ai-agent + their DBs). User and product services are NOT in this compose file — start separately.
- **Testing**: NestJS services: `npm test` (jest). Angular frontend: `ng test` (vitest).

## Important gotchas
- **User-service default port mismatch**: `app.js` defaults to `PORT=3001`, but gateway expects it on 3002. Set `PORT=3002` in `.env` to match.
- **Bid-service default port mismatch**: `app.js` defaults to `PORT=3000`, but gateway expects it on 3005. Set `PORT=3005` in `.env` to match.
- **Bid-service `.env.example` says `PORT=3002`** — this is wrong for both standalone and Docker. Ignore it; use 3005.
- **Gateway expects all downstream services on specific ports**. Start all backend services before testing through gateway.
- **Postgres init scripts** (`migrations/init.sql`) only run on first container init. Recreate volume if schema changes are ignored.
- **Auctions** requires Java 21 and `server.port=${PORT:3003}` is read from env (falls back to 3003).
- **Product-service** uses Go 1.26+ with Gin. Run `go run ./cmd/main.go` (not a build tool wrapping it).
- **Auth-service** has a `test/` dir with e2e tests (`npm run test:e2e`). The health controller has a `.spec.ts` file.

- **Notification architecture**: Microservicios → Cloudflare Worker → Express notification-service → MongoDB. Frontend consulta a través del gateway → Express notification-service.
- **Cloudflare Worker** (`worker.js`) recibe eventos de los microservicios en `POST /notify` con header `x-notify-secret`, valida payload y reenvía al Express notification-service con `x-api-key`.
- **Notification-service** usa MongoDB con Mongoose. En primer arranque los índices se crean automáticamente.
- **Env vars para microservicios**: `WORKER_URL` apunta al Worker de Cloudflare, `NOTIFY_SECRET` es el secreto compartido.
- **Gateway** apunta al Express notification-service (`NOTIFICATION_SERVICE_URL`), no al Worker. El frontend siempre consulta vía gateway.

## AI Agent (ai-agent-service)
- **Location**: `agent/ai-auction-advisor/` (nota: fuera de `microservices/`)
- **Stack**: Python 3.12+ · FastAPI · Mirascope 2.x (Google Gemini) · PostgreSQL · asyncpg
- **Endpoint**: `POST /api/agents/chat` via gateway → FastAPI `POST /chat` en puerto 3009
- **Autenticación**: Gateway inyecta `x-user-id` header desde el JWT del usuario
- **Herramientas del agente**: 11 tools MCP que consultan los servicios de TRATO (subastas, pujas, productos, usuarios) a través del gateway
- **Historial**: Persistente en PostgreSQL por sesión (session_id). Cada conversación guarda mensajes user/assistant.
- **LLM**: Google Gemini 2.0 Flash (configurable via `GEMINI_MODEL` en `.env`)
- **Para correr local**: `cd agent/ai-auction-advisor && source .venv/bin/activate && uvicorn src.app:app --port 3009`
- **Para correr con Docker**: `docker compose up` dentro de `agent/ai-auction-advisor/` (incluye PostgreSQL)
- **API Key**: Necesitas `GOOGLE_API_KEY` en `.env`. La free tier de Gemini tiene cuota limitada (60 req/min).
- **Gateway**: Ruta `/api/agents/*` → `AI_AGENT_SERVICE_URL=http://localhost:3009`

## DB schemas
Reference schemas for all services (including unimplemented ones) are in `doc/trato_microservices_db/`.

## API conventions
- Express services return `{ success: true/false, data: ... }` and validation errors as `{ success: false, errors: [...] }`.
- NestJS gateway uses `{ success, data, message }` format.
- Auth-service uses NestJS `ValidationPipe` with `whitelist: true, forbidNonWhitelisted: true` — unknown fields in DTOs are rejected.
