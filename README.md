# Nirmal Lifecare — website & admin

Pharmaceutical trader & exporter website, built from `Nirmal-Life-Care-Website-Mockups.pdf` (v1, Oct 2026),
with an admin panel for managing products and buyer enquiries.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion ·
Supabase (Postgres, Auth, Storage)

## Run

```bash
npm install
npm run dev      # http://localhost:3000  ·  admin at /admin
npm run build    # type-check + production build
npm start        # serve the production build
```

Without Supabase keys the public site runs on the starter catalog in `src/data/`, and `/admin` shows setup steps.

## Connect Supabase (one-time)

1. **Create a project** at supabase.com.
2. **Create the schema.** Open SQL Editor and run
   `supabase/migrations/20261029000000_init.sql`, then `supabase/seed.sql`
   (8 categories, 43 starter products, placeholder testimonials).
   This also creates the public `product-images` storage bucket.
3. **Add the keys.** Copy `.env.example` to `.env.local` and fill in Project Settings → API:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon or publishable key>
   ```
   Never use the `service_role` / secret key here — everything works through RLS with the public key.
4. **Lock down sign-ups.** Authentication → Sign In / Providers → turn **off** “Allow new users to sign up”.
5. **Create an admin.** Authentication → Users → *Add user* (email + password, auto-confirm). Then in SQL Editor:
   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'you@yourdomain.com';
   ```
6. Restart `npm run dev`, open `/admin`, and sign in.

## Admin panel (`/admin`)

| Screen | What it does |
| --- | --- |
| Dashboard | Product / featured / hidden / new-enquiry counts, latest enquiries, products per category |
| Products | Search, filter by category and status, one-click **Featured** and **Live** toggles, edit, delete |
| Add / edit product | All fields from the product page, auto URL slug, price or “price on request”, therapy tags, drag-and-drop image upload with reordering (first = cover), live preview card |
| Enquiries | Inbox of every form submission (quote pop-up, contact page, home form) with New / Contacted / Closed, call / WhatsApp / email buttons and private notes |

Saving a product revalidates the public pages, so changes are live immediately.

### Security model

- **Authentication:** Supabase Auth (email + password). `src/middleware.ts` refreshes the session and sends
  signed-out visitors to `/admin/login`.
- **Authorisation:** only users listed in `public.admin_users` are admins. The admin layout checks this, and —
  more importantly — every table and the image bucket enforce it with **row-level security**
  (`public.is_admin()`), so the rules hold even if someone calls the API directly.
- Visitors can read active products, categories and published testimonials, and can *insert* enquiries,
  but cannot read enquiries back.

## Where things live

```
supabase/
  migrations/…_init.sql   tables, RLS policies, storage bucket
  seed.sql                starter data (regenerate: node scripts/generate-seed.ts)
src/
  middleware.ts           admin session guard
  app/(site)/             public routes (metadata, static params, 404s)
  app/admin/              admin routes: login, (panel)/ dashboard, products, enquiries
  views/                  public page UIs
  components/             site chrome, product cards, quote modal, search
  components/admin/       admin shell, product form, tables, inbox
  lib/api.ts              public data access (Supabase, or starter catalog fallback)
  lib/admin-api.ts        admin data access (CRUD, image upload, enquiries)
  lib/catalog-server.ts   server-side reads for route metadata / static params
  lib/supabase/           browser / server clients, row ↔ type mappers, config
  data/site.ts            company details — every [bracketed] placeholder from the mockup
```

## Before launch — client content still needed

- Everything in `[brackets]` in `src/data/site.ts` (phone, email, GST, IEC, address, facts, director, story copy).
- Phone/WhatsApp links (`phoneHref`, `whatsappHref`) currently point at a dummy number.
- `site.stats` (500+ products, 1,200+ buyers…) are **sample figures** — replace with real numbers or remove.
- Real testimonials (edit the `testimonials` table), the oncology range, prices, images and descriptions (via the admin).
- Logo, hero/about/director photos, Google Maps embed URL (`views/Contact.tsx`), privacy & terms copy.
