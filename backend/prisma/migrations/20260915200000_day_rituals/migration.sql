-- CreateEnum
CREATE TYPE "DayRitualKind" AS ENUM ('MORNING', 'MIDDAY', 'CLOSE');

-- CreateTable
CREATE TABLE "DayRitual" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "kind" "DayRitualKind" NOT NULL,
    "answers" JSONB NOT NULL,
    "heldAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DayRitual_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DayRitual_userId_day_kind_key" ON "DayRitual"("userId", "day", "kind");

-- CreateIndex
CREATE INDEX "DayRitual_userId_day_idx" ON "DayRitual"("userId", "day");

-- CreateIndex
CREATE INDEX "DayRitual_userId_heldAt_idx" ON "DayRitual"("userId", "heldAt");

-- AddForeignKey
ALTER TABLE "DayRitual" ADD CONSTRAINT "DayRitual_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
