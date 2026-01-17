# Automated Design Generation Operations

This document explains how to store Gemini-generated designs daily into the database and reflect them on the UI.

## Overview
- External worker (Python) generates 3 designs/day via Gemini and posts to `/api/designs`.
- Designs are stored in `Design` table. Publishing a design updates its `Component.code`.
- The UI prefers latest published design code; otherwise falls back to MDX.

## Environment Variables (Vercel)
- `DATABASE_URL`: Supabase Postgres connection string (SSL, URL-encoded password if needed).
- Optional client SDK vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Prisma
```bash
npx prisma generate
npx prisma migrate dev --name add-design-model   # create migration locally
npx prisma migrate deploy                        # apply migrations on deployment
```

## Endpoints
- `POST /api/designs`: create a design
- `GET /api/designs`: list designs (filters: `category`, `variant`, `status`, `limit`)
- `POST /api/designs/:id/publish`: publish a design and update component code

## Python Worker
- Script: `scripts/daily_designs.py`
- Requirements: `scripts/requirements.txt`
- Env vars:
  - `GOOGLE_API_KEY`: Gemini API key
  - `API_BASE`: your deployed app base URL (e.g., https://your-app.vercel.app)
  - `GEMINI_MODEL` (optional): default `gemini-1.5-pro`

Run locally:
```bash
python -m venv .venv && .venv\\Scripts\\activate
pip install -r scripts/requirements.txt
$env:GOOGLE_API_KEY="..."; $env:API_BASE="https://your-app.vercel.app"; python scripts/daily_designs.py
```

## GitHub Actions Scheduler
- Workflow: `.github/workflows/daily-designs.yml`
- Set repository secrets:
  - `GOOGLE_API_KEY`, `API_BASE`, optional `GEMINI_MODEL`

## Windows Task Scheduler (Optional)
- Create a basic task to run daily.
- Action: Start a program
  - Program/script: `python`
  - Add arguments: `scripts/daily_designs.py`
  - Start in: project directory
- Ensure `GOOGLE_API_KEY` and `API_BASE` are provided (use a wrapper `.bat` to set env vars).
