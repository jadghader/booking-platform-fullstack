# Frontend

React + TypeScript client for the booking platform.

## Key Paths

- `src/routes.tsx`: app route map
- `src/components/`: feature UI components
- `src/auth/`: auth state + API layer
- `src/store/`: Redux store
- `src/config/env.ts`: frontend runtime env bindings
- `.env.example`: frontend environment variable template

## Run Locally

1. `cp .env.example .env`
2. `npm install`
3. `npm start`

Default local app URL: `http://localhost:3000`

## Build

- `npm run build`

## Environment Variables

- `REACT_APP_API_BASE_URL`: backend API base URL
- `REACT_APP_SUPPORT_EMAIL`: contact/support email shown in footer
