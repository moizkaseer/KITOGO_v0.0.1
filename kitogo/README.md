# KITOGO — AI Voice Agent for Healthcare Front Desks

KITOGO answers inbound patient phone calls with an AI voice agent, runs a
structured clinical triage flow, and turns every call into a searchable record —
transcript, summary, sentiment, and a wellbeing read — that clinic staff watch
update **live** on a dashboard.

Built with [Next.js](https://nextjs.org) 16, React 19, and TypeScript.

---

## The problem

Clinic front desks are drowning in phone calls.

- **Missed calls = lost patients and revenue.** A large share of calls to busy
  clinics go unanswered. Every one is a missed appointment, a refill request that
  slips, or a patient who phones a competitor instead.
- **Phones don't scale with demand.** Mornings, Mondays, and flu season all
  spike at once. You can't hire a receptionist for the busiest 10 minutes of the
  day and pay them to sit idle the rest of it.
- **After hours is a black hole.** Outside 9–5 most clinics dump callers to
  voicemail. Patients with an urgent-but-not-911 concern get nothing.
- **Front-desk work burns staff out.** Skilled people spend their day on
  repetitive intake — "what's your date of birth, what are you calling about" —
  instead of patient care.
- **The calls that do get answered vanish.** What was said, how urgent it was,
  how the patient sounded — none of it is captured in a structured, reviewable way.

## The solution

KITOGO puts an AI voice agent on the phone line that:

1. **Answers every call, 24/7,** with a natural voice conversation.
2. **Triages the caller** — gathers a structured chief complaint and applies the
   clinic's rules. It never makes a clinical decision; red flags escalate to a
   human.
3. **Writes a structured record of the call** — full transcript, an AI-generated
   summary, the caller's sentiment, and a wellbeing status — to the clinic's
   database.
4. **Streams it to a live dashboard** so staff see calls land and resolve in real
   time, with metrics on volume, duration, and outcomes.

The result: no missed calls, consistent intake, and a reviewable paper trail for
every conversation — without adding front-desk headcount.

---

## How it works

```
   Patient
     │  places a call
     ▼
┌─────────────┐   voice    ┌──────────────────────┐
│  Retell AI  │◄──────────►│   AI voice agent      │
│  (telephony │            │  (conversation +      │
│   + speech) │            │   call_analysis:      │
└──────┬──────┘            │   summary, sentiment) │
       │  webhook events   └──────────────────────┘
       │  (call_started / call_ended / call_analyzed)
       ▼
┌──────────────────────────────┐
│ POST /api/webhooks/retell     │   Next.js route
│   1. normalizeEvent()         │   (src/lib/retell.ts)
│   2. buildCallData()          │   → transcript, summary,
│   3. upsert (nonNullPatch)    │     sentiment, duration
└──────────────┬───────────────┘
               │  insert / merge
               ▼
        ┌──────────────┐   Realtime stream
        │   Supabase    │──────────────────► ┌──────────────────┐
        │  (Postgres)   │                    │  /dashboard       │
        │  calls,       │                    │  live call feed   │
        │  call_events  │                    │  + metrics        │
        └──────────────┘                    └──────────────────┘
```

**Why the pipeline looks like this:** Retell fires multiple webhook events per
call. `call_ended` carries the transcript; `call_analyzed` adds the AI summary,
sentiment, and wellbeing status. The handler **merges** whichever arrives second
(`nonNullPatch`) so a later partial event never overwrites data an earlier one
already saved. All of that logic is pure and lives in `src/lib/retell.ts`, so it
is fully unit-tested without a database.

The marketing site also ships an in-app **chat assistant** (`/api/chat`) that
answers prospect questions (pricing, HIPAA, EHR integrations, triage) using a
keyword-intent engine with per-IP rate limiting — designed to drop in streaming
Claude responses when an API key is present.

---

## Tech stack

| Layer | Technology | Role |
| --- | --- | --- |
| Framework | **Next.js 16** (App Router) + **React 19** | Site, API routes, dashboard |
| Language | **TypeScript** | End-to-end type safety |
| Voice / telephony | **Retell AI** | Handles the live call, speech-to-text, and the AI conversation; posts webhook events |
| Database | **Supabase Postgres** | Stores `calls` and `call_events` |
| Realtime | **Supabase Realtime** | Pushes new/updated calls to the dashboard instantly |
| Auth | **Supabase Auth** | Protects the staff dashboard |
| AI summaries / chat | **Anthropic Claude** (optional) | Call summaries (or Retell's built-in `call_analysis`) and richer chat replies |
| Styling | **Tailwind CSS v4** | UI |
| Testing | **Vitest** | Unit tests for the core logic |
| Hosting | **Vercel** | Deployment |

---

## Prerequisites

- **Node.js 20.19+ or 22.12+**
- **pnpm** (`npm install -g pnpm`) — the repo ships a `pnpm-lock.yaml`
- A **Supabase** project (for the dashboard / webhook pipeline)
- A **Retell AI** account (only needed to receive live calls)

> The marketing site and the unit tests run with **no external credentials**.
> Credentials are only needed for the live dashboard and call pipeline.

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

- Site: [http://localhost:3000](http://localhost:3000)
- Live dashboard: [http://localhost:3000/dashboard](http://localhost:3000/dashboard) (needs Supabase credentials)
- Retell webhook: point your Retell agent at `POST /api/webhooks/retell`
  (health check: `GET /api/webhooks/retell`)

## Running the tests

Unit tests use [Vitest](https://vitest.dev) and live next to the code they cover
in `src/lib/`. They are pure — **no** environment variables or network access.

```bash
pnpm test            # run the suite once
pnpm test:watch      # re-run on change
pnpm test:coverage   # run with a coverage report
```

| Test file | Logic under test |
| --- | --- |
| `src/lib/chat-fallback.test.ts` | `findIntent` — intent matching for every category and the default fallback |
| `src/lib/retell.test.ts` | `normalizeEvent`, `buildCallData`, `nonNullPatch` — event normalization, row mapping (summary/sentiment folding, duration rounding, null handling), and partial-update safety |
| `src/lib/rate-limit.test.ts` | `createRateLimiter` — per-key budgets, window resets, and limits |

---

## Project structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts              # chat assistant (uses rate-limit + chat-fallback)
│   │   ├── calls/…                    # call data endpoints
│   │   ├── stats/route.ts             # dashboard metrics
│   │   └── webhooks/retell/route.ts   # Retell event handler (uses lib/retell)
│   ├── dashboard/                     # live, auth-protected dashboard
│   ├── demo/                          # demo flow components
│   └── (marketing pages)
├── components/                        # UI sections, layout, icons
├── data/                              # static content (careers, personas, resources)
└── lib/
    ├── chat-fallback.ts               # intent engine         (+ .test.ts)
    ├── retell.ts                      # webhook pure helpers   (+ .test.ts)
    └── rate-limit.ts                  # in-memory rate limiter (+ .test.ts)
```

The pure business logic lives in `src/lib/` so the API routes stay thin and the
logic is unit-testable without importing `next/server` or the Supabase client.

## Deployment

The app deploys to [Vercel](https://vercel.com). Add the environment variables
above in the Vercel project settings and connect the Git repository; pushes to
`main` deploy automatically.
