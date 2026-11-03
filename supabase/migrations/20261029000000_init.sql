-- Nirmal LifeCare — initial schema.
-- Run in the Supabase SQL editor (or `supabase db push`), then run supabase/seed.sql.
--
-- Access model (enforced by RLS, not by the app):
--   * Anyone can read active products, categories and published testimonials.
--   * Anyone can submit an enquiry, but cannot read enquiries back.
--   * Only users listed in public.admin_users can change data or read enquiries.

create extension if not exists pgcrypto;

-- ── Admins ──────────────────────────────────────────────────────────────────
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- ── Catalog ─────────────────────────────────────────────────────────────────
create table if not exists public.categories (
  slug        text primary key,
  name        text not null,
  short       text not null,
  form        text not null check (form in ('tablet','capsule','injection','syrup','cream','drops','cardiac','oncology')),
  description text not null default '',
  sort_order  int  not null default 0
);

create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  category    text not null references public.categories (slug) on update cascade,
  strength    text not null default '',
  pack        text not null default '',
  unit        text not null default 'Strip' check (unit in ('Box','Strip','Vial','Bottle','Piece','Tube')),
  composition text not null default '',
  therapy     text[] not null default '{}',
  packaging   text not null default 'Strip' check (packaging in ('Strip','Box','Bottle','Vial','Tube')),
  price       numeric(12,2) check (price is null or price >= 0),
  moq         int check (moq is null or moq > 0),
  featured    boolean not null default false,
  is_active   boolean not null default true,
  description text,
  images      text[] not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_featured_idx on public.products (featured) where featured;

create table if not exists public.testimonials (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  role         text not null default '',
  initials     text not null default '',
  rating       int  not null default 5 check (rating between 1 and 5),
  date         text not null default '',
  topic        text not null default 'Product quality' check (topic in ('Product quality','Response','Delivery')),
  text         text not null,
  is_published boolean not null default true,
  created_at   timestamptz not null default now()
);

-- ── Enquiries (from the quote pop-up, contact page and home form) ───────────
create table if not exists public.enquiries (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  source       text not null check (source in ('home','contact','quote-modal','product','mobile')),
  requirement  text not null check (char_length(requirement) between 1 and 4000),
  mobile       text not null check (char_length(mobile) between 7 and 20),
  email        text check (email is null or char_length(email) <= 254),
  name         text check (name is null or char_length(name) <= 120),
  title        text,
  company      text check (company is null or char_length(company) <= 200),
  buyer_type   text,
  country      text,
  whatsapp     boolean not null default false,
  product_slug text,
  quantity     int check (quantity is null or quantity > 0),
  unit         text,
  status       text not null default 'new' check (status in ('new','contacted','closed')),
  notes        text
);

create index if not exists enquiries_created_idx on public.enquiries (created_at desc);

-- ── updated_at trigger ──────────────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

-- ── Row level security ──────────────────────────────────────────────────────
alter table public.admin_users  enable row level security;
alter table public.categories   enable row level security;
alter table public.products     enable row level security;
alter table public.testimonials enable row level security;
alter table public.enquiries    enable row level security;

drop policy if exists "admins read admin list" on public.admin_users;
create policy "admins read admin list" on public.admin_users
  for select to authenticated using (user_id = auth.uid() or public.is_admin());

drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories
  for select to anon, authenticated using (true);
drop policy if exists "admins write categories" on public.categories;
create policy "admins write categories" on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read active products" on public.products;
create policy "public read active products" on public.products
  for select to anon, authenticated using (is_active or public.is_admin());
drop policy if exists "admins write products" on public.products;
create policy "admins write products" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read published testimonials" on public.testimonials;
create policy "public read published testimonials" on public.testimonials
  for select to anon, authenticated using (is_published or public.is_admin());
drop policy if exists "admins write testimonials" on public.testimonials;
create policy "admins write testimonials" on public.testimonials
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "anyone submits enquiries" on public.enquiries;
create policy "anyone submits enquiries" on public.enquiries
  for insert to anon, authenticated with check (status = 'new' and notes is null);
drop policy if exists "admins read enquiries" on public.enquiries;
create policy "admins read enquiries" on public.enquiries
  for select to authenticated using (public.is_admin());
drop policy if exists "admins update enquiries" on public.enquiries;
create policy "admins update enquiries" on public.enquiries
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admins delete enquiries" on public.enquiries;
create policy "admins delete enquiries" on public.enquiries
  for delete to authenticated using (public.is_admin());

-- ── Storage: product images (public read, admin write) ─────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do nothing;

drop policy if exists "admins upload product images" on storage.objects;
create policy "admins upload product images" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images' and public.is_admin());
drop policy if exists "admins update product images" on storage.objects;
create policy "admins update product images" on storage.objects
  for update to authenticated using (bucket_id = 'product-images' and public.is_admin());
drop policy if exists "admins delete product images" on storage.objects;
create policy "admins delete product images" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images' and public.is_admin());
