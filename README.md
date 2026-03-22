# LedgerComply — Mini Compliance Tracker

A web application to track compliance tasks (GST, audits, tax filings, etc.) across multiple clients.

## Live Demo

(https://ledger-comply.vercel.app/)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Deployment | Vercel |

## Features

- **Client management** — view and select from a list of clients
- **Task board** — view all compliance tasks for a selected client
- **Add task** — create new tasks with title, category, due date, priority, and status
- **Update status** — one-click status transitions (Pending → In Progress → Completed)
- **Filter tasks** — filter by status and category
- **Search tasks** — search tasks by title or description
- **Overdue highlighting** — overdue pending tasks are visually flagged in red
- **Summary stats** — total, pending, in-progress, completed, and overdue counts per client
- **Responsive UI** — works on desktop and mobile

## Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/developer4949-code/LedgerComply.git
cd LedgerComply
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Open the **SQL editor** and run `supabase/schema.sql`
3. Then run `supabase/seed.sql` to populate sample data
4. Copy your project URL and anon key from **Settings → API**

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Deployment (Vercel)

1. Push your repo to GitHub
2. Import the repo at [vercel.com](https://vercel.com)
3. Add the two environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/clients` | Get all clients |
| `POST` | `/api/clients` | Create a new client |
| `GET` | `/api/tasks?client_id=<id>` | Get tasks for a client |
| `POST` | `/api/tasks` | Create a new task |
| `PATCH` | `/api/tasks/:id` | Update task status |
| `DELETE` | `/api/tasks/:id` | Delete a task |

## Tradeoffs

- **No authentication** — assumed single-user/internal tool context given the scope. Adding Supabase Auth would be the natural next step.
- **Next.js API routes instead of a separate backend** — reduces complexity and deployment overhead. Works well for this scale; a dedicated Express/FastAPI backend would make sense if the API grows significantly.
- **Client-side filtering** — filters run in memory on already-fetched tasks, keeping the UI snappy without extra API calls. At large task volumes, server-side filtering would be more efficient.
- **Public RLS policies on Supabase** — for a production app, Row Level Security would be scoped to authenticated users.

## Assumptions

- Task statuses are fixed as: `Pending`, `In Progress`, `Completed`
- Task categories: Tax Filing, Audit, Regulatory, Payroll, GST, Annual Return, Other
- A task is "overdue" if its due date is before today and its status is not `Completed`
- One currency / locale (India, INR) assumed for the seed data context
