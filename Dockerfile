# API only — build context is repo root (works on Railway when no “Root Directory” UI).
# Copies `backend/` into the image.
FROM node:20-bookworm-slim

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci

COPY backend/ .
RUN npx prisma generate

ENV NODE_ENV=production
EXPOSE 5000

# Migrations need DB at runtime (DATABASE_URL on Railway). Build only runs prisma generate above.
CMD ["npm", "start"]
