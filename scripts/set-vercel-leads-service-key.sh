#!/usr/bin/env bash
# Put the lead machine's Supabase secret key on Vercel, verified — without ever printing it.
#
#   bash scripts/set-vercel-leads-service-key.sh              # fetch → prove → write Production
#   bash scripts/set-vercel-leads-service-key.sh --self-test  # prove the guards can fail; touches nothing
#
# Why this exists (2026-08-24): the first release ran with a LEADS_SUPABASE_SERVICE_KEY that
# Supabase rejected (`401 Invalid API key` on every cron run → getSync failed: 401 → no lead
# could be stored). Adapted from ondemandreadings/scripts/set-vercel-supabase-secret.sh:
# (1) always pass --reveal (older CLIs mask secret keys otherwise, and the masked value still
# starts with sb_secret_), (2) refuse anything that looks masked, (3) prove the key against
# this project's REST gateway BEFORE writing it, (4) print the var's updatedAt afterwards so
# a write that did not land is visible.
#
# Run from Git Bash only. PowerShell 5.1 stamps a UTF-8 BOM on every pipe, which corrupts the
# stored value. Env changes only take effect on the NEXT deployment — redeploy afterwards.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REF="${SUPABASE_PROJECT_REF:-apkiueduxqspzefzybpx}"
TARGET="${VERCEL_TARGET:-production}"
VAR="LEADS_SUPABASE_SERVICE_KEY"
REST="https://${REF}.supabase.co/rest/v1/ilift_lead_sync?select=form_id&limit=1"

# Reads the CLI's JSON on stdin; writes the first usable secret key to stdout, no newline.
# Exits 1 with a reason on stderr when nothing usable is present.
SELECT_KEY='
let d = "";
process.stdin.on("data", c => d += c).on("end", () => {
  let j;
  try { j = JSON.parse(d); } catch { console.error("api-keys output is not JSON"); process.exit(1); }
  const masked = /[*•…]/;
  const candidates = (Array.isArray(j) ? j : []).filter(k =>
    typeof k.api_key === "string" && k.api_key.startsWith("sb_secret_") && !k.disabled);
  const usable = candidates.filter(k => !masked.test(k.api_key) && k.api_key.length >= 30);
  if (!usable.length) {
    console.error(candidates.length
      ? "secret key is MASKED — the CLI was run without --reveal"
      : "no sb_secret_ key on this project (create one under Settings → API Keys)");
    process.exit(1);
  }
  process.stdout.write(usable[0].api_key);
});
'

# Reads the key from $KEY; prints "<status> <verdict>" only.
PROBE='
const key = process.env.KEY, url = process.env.REST;
fetch(url, { headers: { apikey: key, Authorization: "Bearer " + key } }).then(async r => {
  const body = await r.text();
  const verdict = r.status === 200 ? "OK"
    : body.includes("Invalid API key") ? "KONG_REJECTED"
    : "REACHED_POSTGREST_BUT_NOT_SERVICE_ROLE";
  console.log(r.status + " " + verdict);
}).catch(e => { console.log("0 FETCH_FAILED " + e.message); });
'

shape() { # $1 = key; prints only non-identifying facts
  KEY="$1" node -e '
    const k = process.env.KEY;
    console.log("shape: prefix=" + k.slice(0, 10) + " len=" + k.length
      + " ascii=" + /^[\x21-\x7e]+$/.test(k) + " trimmed=" + (k === k.trim()));'
}

if [[ "${1:-}" == "--self-test" ]]; then
  echo "[1/3] masked key must be refused:"
  if printf '%s' '[{"name":"default","api_key":"sb_secret_****************************"}]' \
       | node -e "$SELECT_KEY" >/dev/null 2>/tmp/st.err; then
    echo "  FAIL: masked key was accepted"; exit 1
  else
    echo "  ok — refused: $(cat /tmp/st.err)"
  fi
  echo "[2/3] unmasked key must be selected (synthetic, not a real key):"
  out="$(printf '%s' '[{"name":"anon","api_key":"eyJx"},{"name":"default","api_key":"sb_secret_SYNTHETIC_0123456789abcdefghij"}]' \
       | node -e "$SELECT_KEY")"
  [[ "$out" == "sb_secret_SYNTHETIC_0123456789abcdefghij" ]] && echo "  ok — selected the sb_secret_ entry" || { echo "  FAIL: got '$out'"; exit 1; }
  echo "[3/3] gateway probe must reject a bogus key:"
  res="$(KEY='sb_secret_bogus_bogus_bogus_bogus_bogus' REST="$REST" node -e "$PROBE")"
  [[ "$res" == "401 KONG_REJECTED" ]] && echo "  ok — $res" || { echo "  FAIL: $res"; exit 1; }
  echo "self-test passed"
  exit 0
fi

echo "fetching secret key for project $REF (revealed, never printed)…"
KEY="$(supabase projects api-keys --project-ref "$REF" --reveal -o json 2>/tmp/apikeys.err \
       | node -e "$SELECT_KEY")" || { echo "fetch failed:"; sed 's/sb_secret_[^ ]*/sb_secret_[MASKED]/g' /tmp/apikeys.err | head -5; exit 1; }
shape "$KEY"

echo "proving the key against $REST …"
res="$(KEY="$KEY" REST="$REST" node -e "$PROBE")"
echo "  probe: $res"
[[ "$res" == "200 OK" ]] || { echo "refusing to write a key the gateway does not accept"; exit 1; }

echo "writing $VAR ($TARGET) on Vercel project linked at $ROOT …"
printf '%s' "$KEY" | vercel env add "$VAR" "$TARGET" --force --sensitive --cwd "$ROOT" 2>&1 | grep -viE 'sb_secret_' || true

echo "post-write metadata:"
vercel env ls --json --cwd "$ROOT" 2>/dev/null | VAR="$VAR" node -e '
  let d = ""; process.stdin.on("data", c => d += c).on("end", () => {
    const j = JSON.parse(d); const envs = j.envs || j;
    for (const e of envs) if (e.key === process.env.VAR)
      console.log("  " + e.key + " " + (e.target || []).join("/") + " created=" + new Date(e.createdAt).toISOString()
        + " updated=" + new Date(e.updatedAt).toISOString());
  });'
echo "done — now redeploy (a new deployment is what picks the value up) and watch ilift_lead_sync for the first row."
