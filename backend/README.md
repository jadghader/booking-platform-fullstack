# Backend

Express + TypeScript API for authentication, users, services, bookings, reviews, and subscriptions.

## Stack

- Node.js + Express
- TypeScript
- Prisma ORM
- MySQL

## Key Paths

- `src/index.ts`: API server bootstrap
- `src/routes/`: route definitions
- `src/controllers/`: request handlers
- `src/auth/`: JWT/code services
- `prisma/schema.prisma`: data model
- `prisma/migrations/`: DB migrations
- `.env.example`: required backend environment variables

## Run Locally

1. `cp .env.example .env`
2. Set real values in `.env`
3. `npm install`
4. `npm run generate`
5. `npm run dev`

## Scripts

- `npm run dev`: watch + run compiled server
- `npm run build`: compile TypeScript
- `npm run start`: run compiled server from `dist`
- `npm run generate`: Prisma client generation

## Environment Notes

- Secrets must stay in `.env` only.
- `DATABASE_URL` must point to the same DB name used by Prisma (`classified_services`).
