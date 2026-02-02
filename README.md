# CommitmentWebsite

## Supabase waitlist setup

### Environment variables

Create a `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_ANON_KEY"

# Optional (server-side only). If omitted, the API route will fall back to the anon key.
SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY"
```

### Table + RLS policy (INSERT-only for anon)

Your `waitlist` table is expected to be:

```sql
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamp with time zone not null default now()
);
```

Enable RLS and allow `anon` to INSERT only:

```sql
alter table public.waitlist enable row level security;

create policy "anon can insert waitlist"
on public.waitlist
for insert
to anon
with check (true);
```

Do **not** add SELECT/UPDATE/DELETE policies for `anon` (so the public cannot read or modify waitlist entries).

### Test the API route

```bash
curl -X POST "http://localhost:3000/api/waitlist" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"user@example.com\"}"
```
