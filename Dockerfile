# API only — build context is repo root (works on Railway when no “Root Directory” UI).
# Copies `backend/` into the image.
FROM node:20-bookworm-slim

# Prisma → Postgres (TLS) often needs certs in slim images
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci

COPY backend/ .
RUN npx prisma generate

ENV NODE_ENV=production
EXPOSE 5000

# Migrations need DATABASE_URL at runtime (set on Railway). Use local prisma binary (no npx ambiguity).
CMD ["sh", "-c", "set -e && ./node_modules/.bin/prisma migrate deploy && exec node server.js"]
