#!/usr/bin/env bash
# Allow passwordless local TCP connections so the app can connect.
# Run once: npm run db:fix   (or ./scripts/fix-pg-hba.sh)

set -e
DATA_DIR="${POSTGRES_DATA_DIR:-$HOME/postgresql-15-data}"
HBA="$DATA_DIR/pg_hba.conf"

if [ ! -f "$HBA" ]; then
  echo "Not found: $HBA (is Postgres data dir correct?)"
  exit 1
fi

# Ensure we have a line that allows trust from 127.0.0.1 (no password)
if grep -q '127.0.0.1/32.*trust' "$HBA"; then
  echo "pg_hba.conf already allows trust from 127.0.0.1"
else
  # Remove any existing 127.0.0.1 line so we can add trust
  if grep -q '127.0.0.1/32' "$HBA"; then
    sed -i.bak '/127\.0\.0\.1\/32/d' "$HBA"
  fi
  # Add trust for local TCP (at the end)
  echo "host    all             all             127.0.0.1/32            trust" >> "$HBA"
  echo "Updated pg_hba.conf: allow trust from 127.0.0.1"
fi

# Reload Postgres so it picks up the change
pg_ctl -D "$DATA_DIR" reload 2>/dev/null || echo "Run: pg_ctl -D $DATA_DIR reload"
echo "Done. Restart the backend and try logging in again."
