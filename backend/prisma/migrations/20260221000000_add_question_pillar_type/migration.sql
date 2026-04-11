-- CreateEnum (skip if already exists)
DO $$ BEGIN
  CREATE TYPE "Pillar" AS ENUM ('IDENTITY', 'PURPOSE', 'RHYTHMS', 'ENVIRONMENT', 'FRAGMENTATION');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "QuestionType" AS ENUM ('STANDARD', 'PENALTY');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- AlterTable: add pillar and questionType to Question
ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "pillar" "Pillar" NOT NULL DEFAULT 'PURPOSE';
ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "questionType" "QuestionType" NOT NULL DEFAULT 'STANDARD';
