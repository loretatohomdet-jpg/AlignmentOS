-- Tables referenced in schema.prisma but missing from earlier migrations (fixes 42P01 AlignmentProfile).

CREATE TABLE IF NOT EXISTS "AlignmentProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "aqScore" DOUBLE PRECISION NOT NULL,
    "primaryDomain" TEXT,
    "archetype" TEXT,
    "pillarScores" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AlignmentProfile_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "AlignmentProfile_userId_key" ON "AlignmentProfile"("userId");
CREATE INDEX IF NOT EXISTS "AlignmentProfile_userId_createdAt_idx" ON "AlignmentProfile"("userId", "createdAt");

DO $$ BEGIN
  ALTER TABLE "AlignmentProfile" ADD CONSTRAINT "AlignmentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "AlignmentProfile" ADD CONSTRAINT "AlignmentProfile_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "Habit" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "level" INTEGER NOT NULL,
    "pillar" "Pillar" NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Habit_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ActiveHabit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "habitId" TEXT NOT NULL,
    "profileId" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActiveHabit_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ActiveHabit_userId_habitId_key" ON "ActiveHabit"("userId", "habitId");
CREATE INDEX IF NOT EXISTS "ActiveHabit_userId_idx" ON "ActiveHabit"("userId");

CREATE TABLE IF NOT EXISTS "HabitCompletion" (
    "id" TEXT NOT NULL,
    "activeHabitId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HabitCompletion_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "HabitCompletion_activeHabitId_completedAt_idx" ON "HabitCompletion"("activeHabitId", "completedAt");

DO $$ BEGIN
  ALTER TABLE "ActiveHabit" ADD CONSTRAINT "ActiveHabit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "ActiveHabit" ADD CONSTRAINT "ActiveHabit_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "ActiveHabit" ADD CONSTRAINT "ActiveHabit_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "AlignmentProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "HabitCompletion" ADD CONSTRAINT "HabitCompletion_activeHabitId_fkey" FOREIGN KEY ("activeHabitId") REFERENCES "ActiveHabit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
