# Database

MySQL container setup and bootstrap SQL for the booking platform.

## Contents

- `Dockerfile`: MySQL 8 image with init scripts copied to `/docker-entrypoint-initdb.d`
- `init/create-tables.sql`: creates `classified_services` and all schema tables/constraints

## Usage

With Docker Compose from project root:

1. `cp .env.example .env`
2. `docker compose up --build db`

Notes:
- MySQL init scripts run only on first container initialization for a fresh data volume.
- If you need to re-run init scripts, remove the DB volume and start again.
