# AGENTS

## Repository shape
- No root workspace runner (`package.json`, lockfile, or task config). Run commands inside each service directory.
- Active code lives in `user-service` and `bid-service` (Express + PostgreSQL).
- `auctions-service` is Spring Boot (Java) + PostgreSQL.
- `auth-service` is currently an empty placeholder.

## Entrypoints and boundaries
- `user-service/src/app.js`: `/health`, `/users`, and nested `/users/:userId/profile` on port `3001`.
- `bid-service/src/app.js`: `/health`, `/bids`, `/logs` on port `3002`.
- `auctions-service` (Spring Boot): `/health`, `/auctions`, `/auction-events` on port `3003`.
- Each service initializes DB schema via `migrations/init.sql` mounted in Docker Compose.

## Commands
- Per service (`user-service` or `bid-service`): `npm install`, `npm run dev`, `npm start`.
- Per service full stack (API + Postgres): `docker compose up --build`.
- Auctions service (Spring Boot): `./mvnw test`, `./mvnw spring-boot:run`.
- Auctions service full stack (API + Postgres): `docker compose up --build` (run inside `auctions-service`).

## Verification
- No test/lint/typecheck scripts are defined.
- Verify with health and endpoint smoke checks (for example `GET /health`, then the service routes above).

## Important gotchas
- `bid-service/docker-compose.yml` maps DB host port `5433` to container `5432`, but `.env.example` uses `DB_PORT=5432`. If running API outside Docker, set `DB_PORT=5433` for bid-service.
- `user-service/src/config/database.js` default DB credentials (`root`/`1234`) do not match `.env.example` (`postgres`/`postgres`). Prefer explicit env vars; do not rely on defaults.
- `auctions-service` runs on Java 21 (`pom.xml` uses `java.version=21`).
- Postgres init scripts in `migrations/init.sql` only run on first container init for a fresh DB volume. If schema changes seem ignored, recreate the volume.

## API conventions to preserve
- Both services return JSON with `success` (`true/false`) and use `express-validator` errors as `{ success: false, errors: [...] }`.
- Bid lifecycle rules are enforced in `bid-service/src/controllers/bidController.js` (status transitions, delete restrictions, and automatic bid log writes inside transactions).
