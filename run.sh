#!/usr/bin/env bash

set -euo pipefail

cd /home/nickrodi/services/website

echo "Production hosting now uses PM2 + Cloudflare Tunnel on port 3000."
echo "Use ./deploy.sh to update the live site or npm run dev for local development."
