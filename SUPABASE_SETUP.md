# Supabase setup checklist for JHVOlympics

Follow these steps in the [Supabase Dashboard](https://supabase.com/dashboard) for project **iwlpsaxfxeivyzwtvntr**.

## 1. Make sure the project is running

- Open your project in the dashboard
- If you see **“Project paused”**, click **Restore project**
- Paused projects block all API requests

## 2. Copy API credentials into `.env.local`

Go to **Project Settings → API** (or **Connect**):

```env
NEXT_PUBLIC_SUPABASE_URL=https://iwlpsaxfxeivyzwtvntr.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

You can also use the legacy **anon** key as `NEXT_PUBLIC_SUPABASE_ANON_KEY` — either works.

Restart the dev server after changing `.env.local`:

```bash
npm run dev
```

## 3. Configure Authentication URLs

Go to **Authentication → URL Configuration**:

| Setting | Value (local dev) |
|---------|-------------------|
| **Site URL** | `http://localhost:3000` |
| **Redirect URLs** | `http://localhost:3000/**` |

Add these redirect URLs (one per line is fine):

```
http://localhost:3000/auth/callback
http://localhost:3000/**
```

When you deploy to Vercel, also add:

```
https://YOUR-APP.vercel.app/auth/callback
https://YOUR-APP.vercel.app/**
```

## 4. Enable Email sign-up

Go to **Authentication → Providers → Email**:

- **Enable Email provider** — ON
- **Confirm email** — OFF for local testing (recommended while developing)
  - If ON, users must click the confirmation link in their email before they can log in
- **Secure email change** — optional

## 5. Run database migrations

Go to **SQL Editor → New query**, then run each file in order:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_elo_ratings.sql`
3. `supabase/migrations/003_icon_keys.sql`
4. `supabase/migrations/004_guest_player.sql`
5. `supabase/migrations/005_guest_display_name.sql`

Click **Run** after pasting each file. You should see “Success” with no errors.

## 6. Verify a user was created (after sign-up)

Go to **Authentication → Users**. After signing up in the app, your user should appear here.

If sign-up works but login fails with “Email not confirmed”, go back to step 4 and disable **Confirm email**, or confirm the user manually from the Users table.

## 7. Common errors

| Error | Fix |
|-------|-----|
| `Load failed` | Restart dev server; check `.env.local` has URL + key; ensure project is not paused |
| `Invalid login credentials` | Wrong password, or account doesn’t exist yet — sign up first |
| `Email not confirmed` | Disable “Confirm email” in Auth settings, or click the confirmation link |
| `Email address invalid` | Use a real email domain (e.g. Gmail), not `test@example.com` |
| Database errors after login | Run migrations from step 5 |

## Quick test

1. Open `http://localhost:3000/signup`
2. Use a **real email** (Gmail, etc.) and password (6+ chars)
3. You should land on the dashboard
4. Check **Authentication → Users** in Supabase to confirm
