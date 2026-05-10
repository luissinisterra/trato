# AGENTS

## Architecture Overview
- **Entry point**: `gateway-service` on port 3000 (NestJS). All client requests go through here.
- Services forward to backend microservices based on path: `/auth/*` → 3001, `/users/*` → 3002, `/auctions/*` → 3003, `/bids/*` → 3005.

## Services and Ports
| Service | Port | Stack | DB Port (host) |
|---------|------|-------|----------------|
| gateway-service | 3000 | NestJS | - |
| auth-service | 3001 | NestJS + TypeORM | 5435 |
| user-service | 3002 | Express + PG | 5432 |
| auctions-service | 3003 | Spring Boot (Java 21) | 5434 |
| bid-service | 3005 | Express + PG | 5433 |
| product-service | - | (not implemented) | - |
| payment-service | - | (not implemented) | - |
| report-service | - | (not implemented) | - |

## Commands
- **Gateway**: `cd gateway-service && npm run start:dev` (port 3000)
- **Auth**: `cd auth-service && npm run start:dev` (port 3001)
- **User/Bid** (Express): `cd <service> && npm run dev`
- **Auctions** (Spring Boot): `cd auctions-service && ./mvnw spring-boot:run`
- **Full stack** (API + Postgres): `docker compose up --build` inside each service directory

## Important gotchas
- Gateway expects services on specific ports. Start all backend services before testing through gateway.
- `bid-service/.env` sets `DB_PORT=5433` (host), but container maps to 5432. Use 5433 when running API outside Docker.
- Postgres init scripts (`migrations/init.sql`) only run on first container init. Recreate volume if schema changes are ignored.
- `auctions-service/pom.xml` requires Java 21.

## API conventions
- Express services return `{ success: true/false, data: ... }` and validation errors as `{ success: false, errors: [...] }`.
- NestJS gateway uses `{ success, data, message }` format.
