#!/usr/bin/env bash
# Store META_CAPI_TOKEN on Vercel, verified — without ever printing it.
#
#   bash scripts/set-vercel-meta-capi-token.sh                   # prompt (hidden) → prove → write Production
#   bash scripts/set-vercel-meta-capi-token.sh --from-clipboard  # Windows: read the token from the clipboard
#   bash scripts/set-vercel-meta-capi-token.sh --self-test       # prove the guards can fail; touches nothing
#
# Why (2026-08-25): the first stored token failed on the very first LP lead —
# `[lead-machine] capi failed 400 code=190 Error validating application. Invalid application ID.`
# (the same bad-paste pattern as META_PAGE_TOKEN and LEADS_SUPABASE_SERVICE_KEY). This script
# (1) reads the token with echo off, (2) checks paste hygiene (ASCII, no whitespace),
# (3) asks Graph's debug_token who it is, (4) sends ONE Lead event to the real pixel with a
# `test_event_code` — Meta shows those only in Events Manager → Test events and never counts
# them in reporting or optimisation — and requires `events_received: 1`, and only then
# (5) writes the var. Where the token comes from (what actually worked on 2026-08-25 — Events Manager's
# "Generate access token" was nowhere to be found): Business Settings → Users → System users →
# "Conversions API System User" (61574850025857; needs a role on a business-owned app — it was given
# Develop app on "OpenBot Ads Business", Meta's own "Conversions API Application" is not selectable) →
# Generate token → app OpenBot Ads Business → expiration Never → permission ads_management → Copy.
# Run from Git Bash only (PowerShell 5.1 stamps a BOM on pipes). Redeploy afterwards —
# env changes only take effect on the next deployment.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VAR="META_CAPI_TOKEN"
TARGET="${VERCEL_TARGET:-production}"
PIXEL_ID="${META_PIXEL_ID:-1192402142237152}"
GV="${META_GRAPH_VERSION:-v21.0}"
# Meta only accepts the TEST<digits> shape here; TEST_CAPI_TOKEN_PROBE answered 400 code=100 "Invalid parameter".
TEST_CODE="${META_TEST_EVENT_CODE:-TEST48151}"

# Reads $TOKEN; prints one line "<verdict> <facts…>" — never the token.
INSPECT='
const t = process.env.TOKEN, gv = process.env.GV, pixel = process.env.PIXEL_ID, code = process.env.TEST_CODE;
const base = "https://graph.facebook.com/" + gv;
(async () => {
  const hygiene = /^[\x21-\x7e]+$/.test(t) ? "ok" : "BAD(non-ascii-or-whitespace)";
  const dbg = await fetch(base + "/debug_token?input_token=" + encodeURIComponent(t) + "&access_token=" + encodeURIComponent(t))
    .then(r => r.json()).catch(e => ({ error: { message: "fetch failed: " + e.message } }));
  if (dbg.error) { console.log("REJECTED debug_token: " + (dbg.error.message || "").slice(0, 120) + " hygiene=" + hygiene); return; }
  const d = dbg.data || {};
  const exp = d.expires_at ? new Date(d.expires_at * 1000).toISOString() : "never";
  const payload = {
    data: [{
      event_name: "Lead",
      event_time: Math.floor(Date.now() / 1000),
      event_id: "capi-token-probe-" + Date.now(),
      action_source: "website",
      event_source_url: "https://www.ilift.com/lp/contractors",
      user_data: { client_user_agent: "set-vercel-meta-capi-token/probe", client_ip_address: "127.0.0.1" },
    }],
    test_event_code: code,
  };
  const probe = await fetch(base + "/" + pixel + "/events?access_token=" + encodeURIComponent(t), {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    .then(async r => ({ status: r.status, body: await r.json().catch(() => ({})) }))
    .catch(e => ({ status: 0, body: { error: { message: e.message } } }));
  const received = Number(probe.body.events_received || 0);
  const probeMsg = probe.body.error
    ? ("code=" + probe.body.error.code + " " + String(probe.body.error.message).slice(0, 100))
    : ("events_received=" + received + " test_event_code=" + code);
  const ok = hygiene === "ok" && d.is_valid === true && probe.status === 200 && !probe.body.error && received === 1;
  console.log((ok ? "OK" : "REJECTED") + " valid=" + d.is_valid + " type=" + d.type + " app=" + d.application + "(" + d.app_id + ")"
    + " expires=" + exp + " scopes=[" + (d.scopes || []).join(",") + "] hygiene=" + hygiene
    + " pixel_events_probe=" + probe.status + " " + probeMsg);
})();
'

if [[ "${1:-}" == "--self-test" ]]; then
  echo "[1/3] a bogus token must be REJECTED by debug_token:"
  out="$(TOKEN='EAAbogusbogusbogusbogus' GV="$GV" PIXEL_ID="$PIXEL_ID" TEST_CODE="$TEST_CODE" node -e "$INSPECT")"
  [[ "$out" == REJECTED* ]] && echo "  ok — $out" || { echo "  FAIL: $out"; exit 1; }
  echo "[2/3] whitespace in the paste must be flagged:"
  out="$(TOKEN='EAA bogus' GV="$GV" PIXEL_ID="$PIXEL_ID" TEST_CODE="$TEST_CODE" node -e "$INSPECT")"
  [[ "$out" == *"hygiene=BAD"* ]] && echo "  ok — hygiene flagged" || { echo "  FAIL: $out"; exit 1; }
  echo "[3/3] the probe must carry a test_event_code (never a production event):"
  grep -q 'test_event_code: code' "${BASH_SOURCE[0]}" && echo "  ok — probe is a test event" || { echo "  FAIL: probe lost its test_event_code"; exit 1; }
  echo "self-test passed"; exit 0
fi

if [[ "${1:-}" == "--from-clipboard" ]]; then
  # Windows: read the clipboard via PowerShell (stdout only; strip CR/LF). Never echoed.
  TOKEN="$(powershell.exe -NoProfile -Command 'Get-Clipboard -Raw' | tr -d '\r\n')"
  echo "token read from the Windows clipboard"
else
  printf 'Paste the Conversions API access token for pixel %s (input hidden), then Enter: ' "$PIXEL_ID"
  read -rs TOKEN; echo
fi
[[ -n "$TOKEN" ]] || { echo "empty input"; exit 1; }
echo "shape: prefix=${TOKEN:0:3} len=${#TOKEN}"

echo "inspecting the token with Graph (debug_token + ONE test Lead event to pixel $PIXEL_ID)…"
res="$(TOKEN="$TOKEN" GV="$GV" PIXEL_ID="$PIXEL_ID" TEST_CODE="$TEST_CODE" node -e "$INSPECT")"
echo "  $res"
[[ "$res" == OK* ]] || { echo "refusing to store a token Graph does not accept for this pixel"; exit 1; }

echo "writing $VAR ($TARGET) on Vercel project linked at $ROOT …"
printf '%s' "$TOKEN" | vercel env add "$VAR" "$TARGET" --force --sensitive --cwd "$ROOT" 2>&1 | grep -viE 'EAA[A-Za-z0-9]{10,}' || true

echo "post-write metadata:"
vercel env ls --json --cwd "$ROOT" 2>/dev/null | VAR="$VAR" node -e '
  let d = ""; process.stdin.on("data", c => d += c).on("end", () => {
    const j = JSON.parse(d); const envs = j.envs || j;
    for (const e of envs) if (e.key === process.env.VAR)
      console.log("  " + e.key + " " + (e.target || []).join("/") + " updated=" + new Date(e.updatedAt).toISOString());
  });'
echo "done — now redeploy; the next LP lead must log no '[lead-machine] capi failed' line and show a server Lead in Events Manager."
