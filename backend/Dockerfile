# Express + Prisma — explicit image so Railway doesn’t need to guess (avoids Railpack “build plan” failures on monorepos).
FROM node:20-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate && chmod +x scripts/railway-start.sh

ENV NODE_ENV=production
EXPOSE 5000

CMD ["sh", "scripts/railway-start.sh"]
