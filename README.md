# KingProfit — Online Earning Starter (React + Supabase)

This is a ready-to-deploy starter project for **KingProfit** (Black & Gold theme).
It includes user login, tasks, deposit (JazzCash/Easypaisa with screenshot upload), withdraw requests, admin panel, and Supabase schema.

## Quick steps (Vercel + Supabase)
1. Create a Supabase project (https://app.supabase.com).
2. In Supabase → SQL Editor, run `supabase/schema.sql` to create tables and trigger.
3. Create a GitHub repo and upload this project files.
4. In Vercel, connect the GitHub repo and set environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Create a Storage bucket in Supabase named `deposit-proofs` (public or private as you prefer).
6. Deploy on Vercel — it will build automatically.
7. Make yourself admin: Supabase → Table Editor → `profiles` → set `is_admin = true` for your user id.

## Notes
- This is a demo starter. For real payments integrate proper payment gateway and KYC.
- Keep your keys secret; do not commit `.env` to GitHub.
