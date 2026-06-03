# KITOGO

KITOGO is an AI voice-agent platform for healthcare front desks. It answers
inbound patient calls, applies a clinical triage flow, and writes a structured
record (transcript, summary, sentiment) of every call to a live dashboard.

The repository is a [Next.js](https://nextjs.org) 16 / React 19 application
written in TypeScript. It contains the marketing site, an in-app chat assistant,
a Retell AI webhook pipeline, and a real-time operations dashboard backed by
Supabase.

---

## Features

- **Marketing site** — landing page, persona pages, careers, resources, pricing.
- **Chat assistant** (`/api/chat`) — keyword-intent fallback engine with per-IP
  rate limiting; designed to swap in streaming Claude responses.
- **Retell webhook pipeline** (`/api/webhooks/retell`) — normalizes Retell call
  events, folds the AI `call_analysis` (summary + sentiment + wellbeing status)
  into a row, and upserts it to Supabase without overwriting earlier data.
- **Live dashboard** (`/dashboard`) — Supabase-Auth-protected view that streams
  calls in real time via Supabase Realtime.

**Tech stack:** Next.js 16 · React 19 · TypeScript · Supabase (Postgres + Auth +
Realtime) · Retell AI · Vitest.

---

## Prerequisites

- **Node.js 20.19+ or 22.12+**
- **pnpm** (`npm install -g pnpm`) — the repo ships a `pnpm-lock.yaml`
- A **Supabase** project (for the dashboard / webhook pipeline)
- A **Retell AI** account (only needed to receive live calls)

> The marketing site and the unit tests run without any external credentials.
> Credentials are only needed for the dashboard and the live call pipeline.

---

## Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Create your local environment file
cp .env.example .env.local   # then fill in the values below
```

### Environment variables

| Variable | Required for | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Dashboard, webhook | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Dashboard | Public anon key (client reads) |
| `SUPABASE_SERVICE_ROLE_KEY` | Webhook | Service-role key (server writes) |
| `ANTHROPIC_API_KEY` | Optional | Enables real Claude responses in chat |

### Database tables

In the Supabase SQL editor, create the two tables the pipeline writes to:

```sql
create table calls (
  id uuid primary key default gen_random_uuid(),
  retell_call_id text unique not null,
  phone_from text,
  phone_to text,
  status text default 'completed',
  duration_seconds int,
  transcript text,
  summary text,
  sentiment text,
  created_at timestamptz default now()
);

create table call_events (
  id uuid primary key default gen_random_uuid(),
  retell_call_id text,
  event_type text,
  payload jsonb,
  received_at timestamptz default now()
);

-- stream new/updated calls to the dashboard
alter publication supabase_realtime add table calls;
```

---

## Running the app

```bash
pnpm dev      # start the dev server at http://localhost:3000
pnpm build    # production build
pnpm start    # serve the production build
pnpm lint     # eslint
```

Open [http://localhost:3000](http://localhost:3000) for the site, and
[http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the live
dashboard (requires Supabase credentials).

To receive live calls, point your Retell webhook at
`POST /api/webhooks/retell`. A health check is available at
`GET /api/webhooks/retell`.

---

## Running the tests

Unit tests are written with [Vitest](https://vitest.dev) and live next to the
code they cover in `src/lib/`. They are pure and need **no** environment
variables or network access.

```bash
pnpm test            # run the suite once
pnpm test:watch      # re-run on change
pnpm test:coverage   # run with a coverage report
```

### What is covered

| Test file | Logic under test |
| --- | --- |
| `src/lib/chat-fallback.test.ts` | `findIntent` — intent matching for every category and the default fallback |
| `src/lib/retell.test.ts` | `normalizeEvent`, `buildCallData`, `nonNullPatch` — Retell event normalization, row mapping (summary/sentiment folding, duration rounding, null handling) and partial-update safety |
| `src/lib/rate-limit.test.ts` | `createRateLimiter` — per-key budgets, window resets, and limits |

---

## Project structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts              # chat assistant endpoint (uses rate-limit + chat-fallback)
│   │   ├── calls/…                    # call data endpoints
│   │   ├── stats/route.ts             # dashboard metrics
│   │   └── webhooks/retell/route.ts   # Retell event handler (uses lib/retell)
│   ├── dashboard/                     # live, auth-protected dashboard
│   ├── demo/                          # demo flow components
│   └── (marketing pages)
├── components/                        # UI sections, layout, icons
├── data/                              # static content (careers, personas, resources)
└── lib/
    ├── chat-fallback.ts               # intent engine        (+ .test.ts)
    ├── retell.ts                      # webhook pure helpers  (+ .test.ts)
    └── rate-limit.ts                  # in-memory rate limiter (+ .test.ts)
```

The pure business logic lives in `src/lib/` so the API routes stay thin and the
logic is unit-testable without importing `next/server` or the Supabase client.

---

## Deployment

The app deploys to [Vercel](https://vercel.com). Add the environment variables
above in the Vercel project settings and connect the Git repository; pushes to
`main` deploy automatically.
