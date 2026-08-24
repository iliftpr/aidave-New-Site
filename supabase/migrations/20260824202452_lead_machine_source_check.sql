-- iLift lead machine: allow the two sources the lead machine writes.
-- The original ilift_leads_source_check (contact_form, dave_agent, cal_booking, scorecard, other) predates the
-- lead machine; 20260824120000_lead_machine.sql added columns but never widened it, so every insert with
-- source = 'meta_lp' (landing page) or 'meta_form' (Instant-Form poller) failed with 23514 on the live DB.
-- Found 2026-08-24 by a rolled-back insert probe before the first deploy. Strictly widening: existing rows all
-- carry one of the old values, so ADD CONSTRAINT validates cleanly. Applied to apkiueduxqspzefzybpx via the
-- Supabase MCP on 2026-08-24 (ledger version 20260824202452) and verified with a rolled-back insert of both sources.

alter table public.ilift_leads drop constraint if exists ilift_leads_source_check;

alter table public.ilift_leads add constraint ilift_leads_source_check
  check (source = any (array[
    'contact_form', 'dave_agent', 'cal_booking', 'scorecard', 'other',
    'meta_lp', 'meta_form'
  ]::text[]));
