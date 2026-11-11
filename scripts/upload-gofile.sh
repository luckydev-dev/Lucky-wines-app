#!/usr/bin/env bash
# Upload one file to Gofile.io and print its download page URL on stdout.
# Usage: scripts/upload-gofile.sh path/to/file.apk
# Optional: GOFILE_TOKEN (account token) keeps files in your account instead of anonymous uploads.
# Progress/errors go to stderr so the URL can be captured with $(...).
set -uo pipefail

FILE="${1:?usage: upload-gofile.sh <file>}"
[ -f "$FILE" ] || { echo "File not found: $FILE" >&2; exit 2; }

auth_args=()
if [ -n "${GOFILE_TOKEN:-}" ]; then
  auth_args=(-H "Authorization: Bearer ${GOFILE_TOKEN}")
fi

extract_link() {
  python3 -c 'import sys, json
try:
    print(json.load(sys.stdin).get("data", {}).get("downloadPage", ""))
except Exception:
    print("")'
}

try_upload() {
  local url="$1" resp link
  resp=$(curl -sS --connect-timeout 20 --max-time 600 "${auth_args[@]}" -F "file=@${FILE}" "$url" 2>/dev/null) || return 1
  link=$(printf '%s' "$resp" | extract_link)
  [ -n "$link" ] || return 1
  printf '%s\n' "$link"
}

for attempt in 1 2 3; do
  # Current endpoint first
  if try_upload "https://upload.gofile.io/uploadfile"; then exit 0; fi

  # Fallback: ask the API for a server name
  server=$(curl -sS --connect-timeout 10 https://api.gofile.io/servers 2>/dev/null | python3 -c 'import sys, json
try:
    print(json.load(sys.stdin)["data"]["servers"][0]["name"])
except Exception:
    print("")')
  if [ -n "$server" ] && try_upload "https://${server}.gofile.io/uploadFile"; then exit 0; fi

  echo "  [retry ${attempt}/3] Gofile upload of $(basename "$FILE") failed" >&2
  sleep 3
done

echo "FAILED" >&2
exit 1
