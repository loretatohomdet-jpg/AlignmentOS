-- Replace Pillar enum with six domains (Identity, Purpose, Mindset, Habits, Environment, Execution).
-- Clears assessment responses/questions (re-seed). Migrates Habit pillar RHYTHMS -> HABITS when Habit exists.
--
-- Must DROP DEFAULT on enum columns before DROP TYPE: Postgres keeps a dependency on the enum
-- from defaults like DEFAULT 'PURPOSE'::"Pillar".

DELETE FROM "Response";
DELETE FROM "Question";

-- Habit may not exist on DBs created only from older migrations (table added via db push elsewhere).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'Habit'
  ) THEN
    ALTER TABLE "Habit" ALTER COLUMN "pillar" DROP DEFAULT;
    ALTER TABLE "Habit" ALTER COLUMN "pillar" SET DATA TYPE TEXT USING "pillar"::TEXT;
    UPDATE "Habit" SET "pillar" = 'HABITS' WHERE "pillar" = 'RHYTHMS';
  END IF;
END $$;

ALTER TABLE "Question" ALTER COLUMN "pillar" DROP DEFAULT;
ALTER TABLE "Question" ALTER COLUMN "pillar" SET DATA TYPE TEXT USING "pillar"::TEXT;

DROP TYPE "Pillar";

CREATE TYPE "Pillar" AS ENUM ('IDENTITY', 'PURPOSE', 'MINDSET', 'HABITS', 'ENVIRONMENT', 'EXECUTION');

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'Habit'
  ) THEN
    ALTER TABLE "Habit" ALTER COLUMN "pillar" SET DATA TYPE "Pillar" USING "pillar"::"Pillar";
  END IF;
END $$;

ALTER TABLE "Question" ALTER COLUMN "pillar" SET DATA TYPE "Pillar" USING "pillar"::"Pillar";
ALTER TABLE "Question" ALTER COLUMN "pillar" SET DEFAULT 'PURPOSE'::"Pillar";
