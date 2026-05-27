# Payment Service

Microservice para gestión de pagos simulados.

## Quick Start

### Local Development

```bash
npm install
npm run dev
```

### With Docker

```bash
docker-compose up --build
```

## API Endpoints

All endpoints require JWT authentication (except health check).

- `GET /health` - Health check
- `POST /payments` - Create payment
- `GET /payments/:id` - Get payment by ID
- `GET /payments/auction/:auctionId` - Get payments for auction
- `PUT /payments/:id` - Update payment status
- `GET /payments/:id/logs` - Get payment audit logs

## Environment Variables

See `.env.example`

## Database

PostgreSQL on port 5436 (host) / 5432 (container)
