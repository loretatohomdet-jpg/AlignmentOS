-- CreateEnum
CREATE TYPE "ReflectionType" AS ENUM ('WEEKLY', 'QUARTERLY');

-- CreateTable
CREATE TABLE "Reflection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ReflectionType" NOT NULL,
    "answers" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reflection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Reflection_userId_createdAt_idx" ON "Reflection"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "Reflection" ADD CONSTRAINT "Reflection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
