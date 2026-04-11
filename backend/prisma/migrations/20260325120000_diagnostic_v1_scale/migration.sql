-- Diagnostic v1.0: Likert 1–5 (was 0–4 in seeded assessments)
ALTER TABLE "Question" ALTER COLUMN "scaleMin" SET DEFAULT 1;
ALTER TABLE "Question" ALTER COLUMN "scaleMax" SET DEFAULT 5;
UPDATE "Question" SET "scaleMin" = 1, "scaleMax" = 5;
