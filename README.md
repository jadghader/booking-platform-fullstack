# Booking Platform

Full-stack booking platform with:
- `frontend`: React + TypeScript client
- `backend`: Express + TypeScript API (Prisma + MySQL)
- `database`: MySQL Docker image + init scripts

## Project Structure

- `frontend/`
  - UI, routing, forms, auth state, and API calls.
  - Uses `REACT_APP_API_BASE_URL` and `REACT_APP_SUPPORT_EMAIL`.
- `backend/`
  - REST API for auth, users, services, bookings, reviews, and subscriptions.
  - Uses Prisma for schema and migrations (`backend/prisma/`).
  - Reads all sensitive config from environment variables.
- `database/`
  - `Dockerfile`: custom MySQL image used by Docker Compose.
  - `init/create-tables.sql`: initialization script executed on first DB startup.
- `docker-compose.yml`
  - Runs `db`, `backend`, and `frontend` services together.
- `.env.example`
  - Root env template for Docker Compose values.
- `backend/.env.example`
  - Backend env template for local backend-only runs.
- `frontend/.env.example`
  - Frontend env template for local frontend-only runs.

## Local Development (without Docker)

1. Backend
   - `cd backend`
   - `cp .env.example .env`
   - Fill real values in `.env`
   - `npm install`
   - `npm run generate`
   - `npm run dev`
2. Frontend
   - `cd frontend`
   - `cp .env.example .env`
   - `npm install`
   - `npm start`
3. Database (local MySQL)
   - Create database name: `classified_services`
   - Run schema setup from `database/init/create-tables.sql`

## Docker Compose

1. Copy root env template:
   - `cp .env.example .env`
2. Fill `.env` with real values (especially JWT + email credentials).
3. Start everything:
   - `docker compose up --build`
4. Access:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8000`
   - MySQL: `localhost:3306`

## Notes

- Do not commit real secrets to source control.
- Prisma schema: `backend/prisma/schema.prisma`
- Database migrations: `backend/prisma/migrations/`
- Folder docs:
  - `backend/README.md`
  - `frontend/README.md`
  - `database/README.md`
