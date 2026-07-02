# JHVOlympics

A mobile-first web app for you and your friends to log 2v2 competitions, track scores by game type, and view leaderboards with win rates.

## Stack

- **Frontend:** Next.js 16, React, TypeScript, Tailwind CSS
- **Backend:** Supabase (Auth + Postgres + Row Level Security)
- **Hosting:** Vercel (frontend) + Supabase (database)

## Features

- Email/password signup and login
- Log matches with game type, 4 players (2 per side), scores, and notes
- Pick an existing game or create a new one when logging
- Automatic ELO ratings (team average vs team average, K=32) per game type
- Match history and detail views
- Leaderboards (overall and per game type)
- Personal W-L-T record and win rate on dashboard and profile

## Live app

**Production:** [https://jhvolympics.vercel.app](https://jhvolympics.vercel.app)

**GitHub:** [https://github.com/ryanfuchs/JHVOlympics](https://github.com/ryanfuchs/JHVOlympics)

Pushes to `main` auto-deploy via Vercel.

## Local development

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/JHVOlympics.git
cd JHVOlympics
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In **Project Settings → API**, copy the **Project URL** and **anon public** key
3. Copy `.env.local.example` to `.env.local` and fill in the values:

```bash
cp .env.local.example .env.local
```

### 3. Run the database migration

In the Supabase dashboard, open **SQL Editor** and run the contents of:

```
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_elo_ratings.sql
```

Or, if you use the Supabase CLI:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

### 4. Configure auth redirect URLs

In Supabase **Authentication → URL Configuration**, add:

- Site URL: `http://localhost:3000` (for local dev)
- Redirect URLs: `http://localhost:3000/auth/callback`

When deployed, also add your Vercel URL (e.g. `https://jhvolympics.vercel.app/auth/callback`).

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy
5. Add your Vercel domain to Supabase auth redirect URLs

## Invite friends

Share the deployed URL. Friends create an account with email/password, then appear in the player picker when logging matches.

## Project structure

```
app/
  (app)/          # Protected app routes (dashboard, matches, leaderboard, profile)
  (auth)/         # Login and signup
  auth/callback/  # Supabase auth callback
components/       # UI components
lib/supabase/     # Supabase client helpers
supabase/migrations/  # Database schema
```

## License

Private — for friends only.
