# AGENTS

## Architecture Overview
- **Entry point**: `microservices/gateway-service` on port 3000 (NestJS). All client requests go through here.
- Gateway forwards by path: `/auth/*` → 3001, `/users/*` → 3002, `/auctions/*` → 3003, `/products/*` → 3004, `/bids/*` → 3005, `/payments/*` → 3006, `/reports/*` → 3007.
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
- **Frontend** (Angular): `cd frontend/trato-front && npm start` (port 4200)
- **Full orchestration**: `docker compose up --build` inside `microservices/gateway-service/` (starts gateway, auth, auctions, bid + their DBs). User and product services are NOT in this compose file — start separately.
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

## DB schemas
Reference SQL schemas for all services (including unimplemented ones) are in `doc/trato_microservices_db/`.

## API conventions
- Express services return `{ success: true/false, data: ... }` and validation errors as `{ success: false, errors: [...] }`.
- NestJS gateway uses `{ success, data, message }` format.
- Auth-service uses NestJS `ValidationPipe` with `whitelist: true, forbidNonWhitelisted: true` — unknown fields in DTOs are rejected.
