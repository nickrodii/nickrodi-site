#!/usr/bin/env bash

set -euo pipefail

APP_DIR="/home/ubuntu/nickrodi-website"
APP_NAME="website"
APP_PORT="3000"

cd "$APP_DIR"

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  # shellcheck source=/dev/null
  . "$NVM_DIR/nvm.sh"
fi

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1"
    exit 1
  fi
}

require_cmd node
require_cmd npm

PM2_BIN="${PM2_BIN:-$(command -v pm2 || true)}"
if [ -z "$PM2_BIN" ]; then
  echo "Missing required command: pm2"
  echo "Load your Node environment or set PM2_BIN before running deploy.sh."
  exit 1
fi

APP_EXISTS=0
if "$PM2_BIN" describe "$APP_NAME" >/dev/null 2>&1; then
  APP_EXISTS=1
fi

if [ ! -d node_modules ] || [ ! -f node_modules/.package-lock.json ] || [ package-lock.json -nt node_modules/.package-lock.json ]; then
  echo "Installing dependencies..."
  npm ci
else
  echo "Dependencies are already up to date."
fi

NEXT_BACKUP=""
cleanup() {
  if [ -n "$NEXT_BACKUP" ] && [ -d "$NEXT_BACKUP" ]; then
    rm -rf "$NEXT_BACKUP"
  fi
}
trap cleanup EXIT

if [ "$APP_EXISTS" -eq 1 ]; then
  echo "Stopping PM2 app '$APP_NAME' for a clean rebuild..."
  "$PM2_BIN" stop "$APP_NAME"
fi

if [ -d .next ]; then
  NEXT_BACKUP="$(mktemp -d /tmp/website-next-backup.XXXXXX)"
  mv .next "$NEXT_BACKUP/.next"
fi

echo "Building production bundle..."
if ! npm run build; then
  echo "Build failed. Restoring the previous production bundle..."
  rm -rf .next

  if [ -n "$NEXT_BACKUP" ] && [ -d "$NEXT_BACKUP/.next" ]; then
    mv "$NEXT_BACKUP/.next" .next
  fi

  if [ "$APP_EXISTS" -eq 1 ]; then
    PORT="$APP_PORT" NODE_ENV=production "$PM2_BIN" start "$APP_NAME" --update-env >/dev/null
  fi

  exit 1
fi

if [ -n "$NEXT_BACKUP" ] && [ -d "$NEXT_BACKUP/.next" ]; then
  rm -rf "$NEXT_BACKUP/.next"
fi

if [ "$APP_EXISTS" -eq 1 ]; then
  echo "Restarting PM2 app '$APP_NAME'..."
  PORT="$APP_PORT" NODE_ENV=production "$PM2_BIN" restart "$APP_NAME" --update-env
else
  echo "Creating PM2 app '$APP_NAME'..."
  PORT="$APP_PORT" NODE_ENV=production "$PM2_BIN" start npm --name "$APP_NAME" -- start
fi

"$PM2_BIN" save >/dev/null

echo "Verifying local health on port $APP_PORT..."

for attempt in $(seq 1 30); do
  if curl -fsSI "http://127.0.0.1:$APP_PORT" >/tmp/website-health-check.$$ 2>/dev/null; then
    sed -n '1,12p' /tmp/website-health-check.$$
    rm -f /tmp/website-health-check.$$
    echo "Deploy complete."
    exit 0
  fi

  sleep 1
done

rm -f /tmp/website-health-check.$$
echo "Local health check failed after waiting 30 seconds."
exit 1
