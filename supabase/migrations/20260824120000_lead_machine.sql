-- iLift lead machine: additive columns + sync watermark table.
-- Applied to project apkiueduxqspzefzybpx on 2026-08-24 via the Supabase MCP.
-- Safe on a live table: every change is nullable/defaulted.

alter table public.ilift_leads
  alter column email drop not null,
  add column if not exists phone_e164 text,
  add column if not exists vertical text,
  add column if not exists pain text,
  add column if not exists tracking jsonb not null default '{}'::jsonb,
  add column if not exists meta_lead_id text,
  add column if not exists called_at timestamptz;

create unique index if not exists ilift_leads_meta_lead_id_key
  on public.ilift_leads (meta_lead_id) where meta_lead_id is not null;

create index if not exists ilift_leads_phone_e164_created_idx
  on public.ilift_leads (phone_e164, created_at desc);

create table if not exists public.ilift_lead_sync (
  form_id text primary key,
  last_created_time timestamptz not null default '1970-01-01T00:00:00Z',
  last_run_at timestamptz,
  last_error text,
  consecutive_errors integer not null default 0
);

alter table public.ilift_lead_sync enable row level security;
-- No anon/authenticated policies on purpose: only the service role touches this table.
