# Report Service

Microservice para generación de reportes con rate limiting.

## Quick Start

### Local Development

```bash
npm install
npm run start:dev
```

### With Docker

```bash
docker-compose up --build
```

## API Endpoints

All endpoints require JWT authentication.

- `POST /reports/generate` - Generate new report (max 10 per 24h)
- `GET /reports/:id` - Get report by ID
- `GET /reports/user/:userId` - List user's reports
- `GET /reports/user/:userId/pending` - List pending requests
- `DELETE /reports/:id` - Delete report

## Features

- Rate limiting: Max 10 reports per user per 24 hours
- JSON storage for flexible report data
- Report types: auction_history, bid_history, earnings, sales_summary
- HTTP calls to other microservices for data aggregation

## Environment Variables

See `.env.example`

## Database

PostgreSQL on port 5437 (host) / 5432 (container)
