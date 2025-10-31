KingProfit — Quick Setup (Urdu)

1) Supabase:
- Account بنائیں، نیا Project بنائیں.
- SQL Editor میں `supabase/schema.sql` چلائیں (یہ tables اور trigger بنائے گا).
- Storage → Buckets → New bucket نام: `deposit-proofs` بنائیں.
- Auth → Settings میں email sign-in enable رکھیں.

2) GitHub:
- نیا repo بنائیں، اس ZIP کی فائلیں upload کریں یا unzip کر کے commit کریں.

3) Vercel:
- Vercel میں GitHub connect کریں، repo select کریں.
- Project Settings → Environment Variables میں یہ شامل کریں:
  VITE_SUPABASE_URL = https://<your-project>.supabase.co
  VITE_SUPABASE_ANON_KEY = <public-anon-key-from-supabase>
- Deploy کریں.

4) Make admin:
- Supabase → Table Editor → profiles → اپنی row تلاش کریں اور is_admin=true کر دیں.

5) Test:
- Open site, signup with email (magic link), login, go to Dashboard, try deposit (upload screenshot), then admin approves in Admin Panel.
