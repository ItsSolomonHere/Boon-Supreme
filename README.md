# Boon Supreme Restaurant

Full-stack MERN app for **Boon Supreme Restaurant** — an authentic Kenyan restaurant on TRM Dr, Nairobi (0734 516782).

## Stack

- **Monorepo:** pnpm workspaces
- **Client:** React 18, Vite, Tailwind CSS v3, React Router v6, Zustand, plain JavaScript
- **Server:** Express 4, Mongoose, JWT (httpOnly cookie), ES modules

## Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io/) 9+
- MongoDB running locally (or set `MONGO_URI` to your cluster)

## Setup

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Environment**

   Copy examples and adjust:

   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

   - `server/.env`: `PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `OPENAI_API_KEY`, `OPENAI_MODEL`
   - `client/.env`: leave `VITE_API_URL` empty in development so `/api` is proxied and login cookies work. Set it in production only if the API is on another origin.

   Set `OPENAI_API_KEY` to enable the AI menu assistant in chat. If not set, chat falls back to keyword responses.

3. **Seed the database**

   ```bash
   pnpm --filter server seed
   ```

4. **Run dev (API + Vite)**

   ```bash
   pnpm dev
   ```

   - Frontend: http://localhost:5173  
   - API: http://localhost:5000  

The Vite dev server proxies `/api` to the backend.

## Admin

Create a user via `/register`, then in MongoDB set that user’s `role` to `admin`, or register first user and update manually. Admin dashboard: `/admin` (menu CRUD + orders list).

## Deploy on Render

This repo includes `render.yaml` for one-click Blueprint deploy (API + frontend).

### 1) Push to GitHub

Push this project to a GitHub repo and connect it in Render.

### 2) Create Blueprint

In Render:

- New + -> Blueprint
- Select your repository
- Render will detect `render.yaml` and create:
  - `boon-supreme-api` (Node web service)
  - `boon-supreme-web` (Static site)

### 3) Set environment variables

For `boon-supreme-api`:

- `MONGO_URI` = your MongoDB Atlas URI
- `JWT_SECRET` = long random secret
- `OPENAI_API_KEY` = your key (optional if chatbot AI enabled)
- `CLIENT_URL` = your frontend Render URL (for example `https://boon-supreme-web.onrender.com`)
  - You can also allow multiple origins by comma-separating URLs.

For `boon-supreme-web`:

- `VITE_API_URL` = your API URL (for example `https://boon-supreme-api.onrender.com`)

### 4) CORS + cookies note

- Backend CORS uses `CLIENT_URL`.
- If frontend and API are on different subdomains, keep both on HTTPS and set exact URLs.

### 5) Seed production menu

After first API deploy, run a one-off seed:

```bash
pnpm --filter server seed
```

Use production `MONGO_URI` when running the seed command.

## License

Private / project use.
