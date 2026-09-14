-- AlterTable
ALTER TABLE "ActiveHabit" ADD COLUMN "endedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "ActiveHabit_userId_endedAt_idx" ON "ActiveHabit"("userId", "endedAt");
