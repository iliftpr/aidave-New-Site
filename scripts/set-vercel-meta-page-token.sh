#!/usr/bin/env bash
# Store META_PAGE_TOKEN on Vercel, verified — without ever printing it.
#
#   bash scripts/set-vercel-meta-page-token.sh              # prompt (hidden) → prove → write Production
#   bash scripts/set-vercel-meta-page-token.sh --self-test  # prove the guards can fail; touches nothing
#
# Why (2026-08-25): the first stored token was rejected by Graph on every poll
# (`code=190 Error validating application. Invalid application ID.`). This script
# (1) reads the token with echo off, (2) checks paste hygiene (ASCII, no whitespace),
# (3) asks Graph's debug_token who it is (valid? type? scopes? expiry?), (4) performs the
# exact call the poller makes against the real form, and only then (5) writes the var.
# Run from Git Bash only (PowerShell 5.1 stamps a BOM on pipes). Redeploy afterwards —
# env changes only take effect on the next deployment.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VAR="META_PAGE_TOKEN"
TARGET="${VERCEL_TARGET:-production}"
FORM_ID="${META_LEAD_FORM_ID:-4103248023306565}"
GV="${META_GRAPH_VERSION:-v21.0}"

# Reads $TOKEN; prints one line "<verdict> <facts…>" — never the token.
INSPECT='
const t = process.env.TOKEN, gv = process.env.GV, form = process.env.FORM_ID;
const base = "https://graph.facebook.com/" + gv;
(async () => {
  const hygiene = /^[\x21-\x7e]+$/.test(t) ? "ok" : "BAD(non-ascii-or-whitespace)";
  const dbg = await fetch(base + "/debug_token?input_token=" + encodeURIComponent(t) + "&access_token=" + encodeURIComponent(t))
    .then(r => r.json()).catch(e => ({ error: { message: "fetch failed: " + e.message } }));
  if (dbg.error) { console.log("REJECTED debug_token: " + (dbg.error.message || "").slice(0, 120) + " hygiene=" + hygiene); return; }
  const d = dbg.data || {};
  const scopes = d.scopes || [];
  const need = ["leads_retrieval", "pages_show_list"];
  const missing = need.filter(s => !scopes.includes(s));
  const exp = d.expires_at ? new Date(d.expires_at * 1000).toISOString() : "never";
  const probe = await fetch(base + "/" + form + "/leads?limit=1&fields=id,created_time&access_token=" + encodeURIComponent(t))
    .then(async r => ({ status: r.status, body: await r.json().catch(() => ({})) }))
    .catch(e => ({ status: 0, body: { error: { message: e.message } } }));
  const probeMsg = probe.body.error ? ("code=" + probe.body.error.code + " " + String(probe.body.error.message).slice(0, 100)) : ("ok data=" + (probe.body.data || []).length);
  const ok = hygiene === "ok" && d.is_valid === true && missing.length === 0 && probe.status === 200 && !probe.body.error;
  console.log((ok ? "OK" : "REJECTED") + " valid=" + d.is_valid + " type=" + d.type + " app=" + d.application + "(" + d.app_id + ")"
    + " expires=" + exp + " missing_scopes=[" + missing.join(",") + "] hygiene=" + hygiene
    + " form_leads_probe=" + probe.status + " " + probeMsg);
})();
'

if [[ "${1:-}" == "--self-test" ]]; then
  echo "[1/2] a bogus token must be REJECTED by debug_token:"
  out="$(TOKEN='EAAbogusbogusbogusbogus' GV="$GV" FORM_ID="$FORM_ID" node -e "$INSPECT")"
  [[ "$out" == REJECTED* ]] && echo "  ok — $out" || { echo "  FAIL: $out"; exit 1; }
  echo "[2/2] whitespace in the paste must be flagged:"
  out="$(TOKEN='EAA bogus' GV="$GV" FORM_ID="$FORM_ID" node -e "$INSPECT")"
  [[ "$out" == *"hygiene=BAD"* ]] && echo "  ok — hygiene flagged" || { echo "  FAIL: $out"; exit 1; }
  echo "self-test passed"; exit 0
fi

printf 'Paste the Page access token for Page 527833293737471 (input hidden), then Enter: '
read -rs TOKEN; echo
[[ -n "$TOKEN" ]] || { echo "empty input"; exit 1; }
echo "shape: prefix=${TOKEN:0:3} len=${#TOKEN}"

echo "inspecting the token with Graph (debug_token + a real read of form $FORM_ID)…"
res="$(TOKEN="$TOKEN" GV="$GV" FORM_ID="$FORM_ID" node -e "$INSPECT")"
echo "  $res"
[[ "$res" == OK* ]] || { echo "refusing to store a token Graph does not accept for this form"; exit 1; }

echo "writing $VAR ($TARGET) on Vercel project linked at $ROOT …"
printf '%s' "$TOKEN" | vercel env add "$VAR" "$TARGET" --force --sensitive --cwd "$ROOT" 2>&1 | grep -viE 'EAA[A-Za-z0-9]{10,}' || true

echo "post-write metadata:"
vercel env ls --json --cwd "$ROOT" 2>/dev/null | VAR="$VAR" node -e '
  let d = ""; process.stdin.on("data", c => d += c).on("end", () => {
    const j = JSON.parse(d); const envs = j.envs || j;
    for (const e of envs) if (e.key === process.env.VAR)
      console.log("  " + e.key + " " + (e.target || []).join("/") + " updated=" + new Date(e.updatedAt).toISOString());
  });'
echo "done — now redeploy; within a minute ilift_lead_sync.last_error should be null and consecutive_errors 0."
