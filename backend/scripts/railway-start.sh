#!/bin/sh
# Used by Dockerfile CMD — fails fast with a clear message if env is wrong.
set -e

if [ -z "$DATABASE_URL" ]; then
  echo "FATAL: DATABASE_URL is not set."
  echo "Railway → AlignmentOS → Variables → add DATABASE_URL referencing Postgres (e.g. \${{ Postgres.DATABASE_URL }})."
  exit 1
fi

echo "Running prisma migrate deploy..."
./node_modules/.bin/prisma migrate deploy

echo "Starting server..."
exec node server.js
