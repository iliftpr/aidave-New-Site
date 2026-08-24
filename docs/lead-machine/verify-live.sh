#!/usr/bin/env bash
# One-shot post-deploy verification of the iLift lead machine on www.ilift.com.
# Read-only except one POST with the honeypot filled (server swallows it: no DB row, no side effects).
H="https://www.ilift.com"; UA="Mozilla/5.0 (verify-live)"
pass=0; fail=0
chk() { if [ "$1" = "$2" ]; then echo "PASS  $3 ($1)"; pass=$((pass+1)); else echo "FAIL  $3 (got '${1:0:100}', want '$2')"; fail=$((fail+1)); fi; }

echo "== deployment serving www =="
html=$(curl -s -A "$UA" --max-time 25 "$H/")
echo "data-dpl-id: $(printf '%s' "$html" | grep -o 'data-dpl-id="[^"]*"' | head -1 | cut -d'"' -f2)"

echo "== landing pages =="
for s in contractors dental-medspa restaurants; do
  code=$(curl -s -o /dev/null -w "%{http_code}" -A "$UA" --max-time 25 "$H/lp/$s")
  chk "$code" "200" "/lp/$s renders"
  body=$(curl -s -A "$UA" --max-time 25 "$H/lp/$s")
  noidx=$(printf '%s' "$body" | grep -c -o 'name="robots" content="noindex' )
  chk "$([ "$code" = 200 ] && [ "$noidx" -ge 1 ] && echo yes || echo no)" "yes" "/lp/$s is noindex (200 only)"
  form=$(printf '%s' "$body" | grep -c -o 'name="phone"')
  chk "$([ "$code" = 200 ] && [ "$form" -ge 1 ] && echo yes || echo no)" "yes" "/lp/$s has the phone field (200 only)"
done

echo "== /leads basic auth (fails closed) =="
hdr=$(curl -s -D - -o /dev/null -A "$UA" --max-time 25 "$H/leads")
chk "$(printf '%s' "$hdr" | head -1 | awk '{print $2}')" "401" "/leads without creds"
chk "$(printf '%s' "$hdr" | grep -i -c 'www-authenticate: basic')" "1" "/leads sends WWW-Authenticate"
chk "$(curl -s -o /dev/null -w '%{http_code}' -A "$UA" --max-time 25 -u 'x:wrong' "$H/leads")" "401" "/leads rejects wrong creds"

echo "== cron endpoint =="
chk "$(curl -s -o /dev/null -w '%{http_code}' -A "$UA" --max-time 25 "$H/api/cron/meta-leads")" "401" "/api/cron/meta-leads without secret"
chk "$(curl -s -o /dev/null -w '%{http_code}' -A "$UA" --max-time 25 -H 'Authorization: Bearer nope' "$H/api/cron/meta-leads")" "401" "/api/cron/meta-leads wrong secret"

echo "== /api/lead validation =="
chk "$(curl -s -o /dev/null -w '%{http_code}' -A "$UA" --max-time 25 -X POST -H 'content-type: application/json' -d '{}' "$H/api/lead")" "400" "POST {} -> 400 phone_required"
chk "$(curl -s -A "$UA" --max-time 25 -X POST -H 'content-type: application/json' -d '{}' "$H/api/lead")" '{"error":"phone_required"}' "POST {} body"
chk "$(curl -s -o /dev/null -w '%{http_code}' -A "$UA" --max-time 25 -X POST -H 'content-type: application/json' -d 'not json' "$H/api/lead")" "400" "POST bad json -> 400"
chk "$(curl -s -A "$UA" --max-time 25 -X POST -H 'content-type: application/json' -d '{"phone":"5163229380","website":"http://bot.example"}' "$H/api/lead")" '{"ok":true}' "honeypot swallowed (no row, no pings)"
chk "$(curl -s -A "$UA" --max-time 25 -X POST -H 'content-type: application/json' -d '{"phone":"5163229380","vertical":"nope"}' "$H/api/lead")" '{"error":"bad_vertical"}' "bad vertical rejected before any side effect"

echo; echo "RESULT: $pass pass, $fail fail"
[ "$fail" -eq 0 ]
