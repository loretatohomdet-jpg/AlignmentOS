# Express + Prisma — explicit image so Railway doesn’t need to guess (avoids Railpack “build plan” failures on monorepos).
FROM node:20-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate

ENV NODE_ENV=production
EXPOSE 5000

CMD ["npm", "start"]
