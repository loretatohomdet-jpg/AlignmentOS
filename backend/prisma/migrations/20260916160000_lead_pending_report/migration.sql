-- AlterTable
ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "pendingReport" JSONB;
