#!/usr/bin/env bash
# Start PostgreSQL from your home data dir and ensure the app database exists.
# Run from backend: ./scripts/start-postgres.sh   or   npm run db:start

set -e

# Required on some macOS setups so PostgreSQL can start (avoids "postmaster became multithreaded" fatal).
export LC_ALL="${LC_ALL:-en_US.UTF-8}"
export LANG="${LANG:-en_US.UTF-8}"

DATA_DIR="${POSTGRES_DATA_DIR:-$HOME/postgresql-15-data}"
DB_NAME="${POSTGRES_DB_NAME:-alignment_index_db}"

if [ ! -d "$DATA_DIR" ]; then
  echo "PostgreSQL data directory not found: $DATA_DIR"
  echo "Create and init it first:"
  echo "  mkdir -p $DATA_DIR"
  echo "  initdb -D $DATA_DIR"
  exit 1
fi

# Start if nothing is listening on 5432
if ! lsof -i :5432 -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo "Starting PostgreSQL (data: $DATA_DIR)..."
  pg_ctl -D "$DATA_DIR" -l "$DATA_DIR/server.log" start
  sleep 2
fi

# Ensure DB exists (idempotent). Use TCP (127.0.0.1) after pg_hba allows it.
createdb -h 127.0.0.1 -U "$USER" "$DB_NAME" 2>/dev/null || true

echo "PostgreSQL is running. Database: $DB_NAME"
