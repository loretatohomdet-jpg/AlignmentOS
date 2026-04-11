# Alignment Index – Backend

## Run the app

1. **Start PostgreSQL** (uses data in `~/postgresql-15-data`; start this once per session or after reboot):
   ```bash
   npm run db:start
   ```
2. **Start the server**:
   ```bash
   npm start
   ```

## First-time setup (already done if you ran this before)

- Create Postgres data dir and init: `mkdir -p ~/postgresql-15-data && initdb -D ~/postgresql-15-data`
- Create DB: `createdb -h ~/postgresql-15-data -U $(whoami) alignment_index_db`
- Migrate: `npx prisma migrate dev`
- Seed: `npm run seed`

Demo login: **demo@alignment.local** / **password123**
