# Alignment OS — Complete Implementation Plan

This document maps the full Alignment OS spec to the current codebase and provides a **step-by-step modular plan** (schema, calculation logic, habit engine, UI, content) so the module can be implemented end-to-end for **individuals** and **businesses**.

---

## Part 1: Gap analysis — what’s done vs missing

### ✅ In place today

| Area | Current state |
|------|----------------|
| **Users & auth** | `users` table, JWT auth, signup/login, profile. |
| **Assessments** | `assessments`, `questions`, `responses`; single active assessment; submit and get result. |
| **Scoring (simplified)** | One overall 0–100 score; label (High/Moderate/Low). Formula: normalized average of responses → × 100. Stored in `AlignmentIndexScore`. |
| **Results UI** | Results page with circular progress (total score), human message, “How to use it,” link to Simplicity & Productivity. |
| **Dashboard** | Summary cards, radial gauge (current score), area chart (score over time), CTAs. |
| **Business page** | Journey copy: Diagnostic → Score & Report → Micro Habits → Quarterly Review → Gap Closure; goals, benefits, CTA. |
| **Pricing, Shop, Privacy, Terms** | Present. |

### ❌ Not yet implemented (from spec)

| Area | Missing |
|------|--------|
| **Four pillars** | No Identity, Purpose, Rhythms, Environment; questions not mapped to pillars. |
| **AQ Score & formula** | No “AQ” branding; no `(raw_sum / 20) * 25` normalization; no fragmentation penalty; no `primary_domain` (primary source of misalignment). |
| **Alignment report** | No structured report with strengths, gaps, primary misalignment. |
| **Habits** | No `habits`, `active_habits`, `habit_completions`; no Level 1–3 or pillar/tag-based assignment. |
| **Alignment profiles** | No `alignment_profiles` (per-user/per-assessment snapshot of pillars + metadata). |
| **Segment tags** | No optional tags (e.g. motherhood) for habit assignment. |
| **Results UI (spec)** | No four stacked pillar progress bars; no “primary misalignment” highlight; no strict #111111 + soft grays, no red/green. |
| **Daily habits dashboard** | No “today’s habits” or habit completion. |
| **Formation modal** | No modal after 14 days of habits or AQ < 70 inviting to Simplicity platform. |
| **Quarterly reassessment** | Implemented: Dashboard shows “Quarterly reassessment” card when last assessment ≥90 days ago; Results “How to use it” includes quarterly instructions. |
| **Content** | No dedicated copy blocks for diagnostic feedback, habit suggestions, quarterly instructions, Formation invitation; business benefits are partial. |

---

## Part 2: High-level workflow (target state)

1. **Diagnostic** — Survey with questions mapped to four pillars (Identity, Purpose, Rhythms, Environment). Computes **AQ Score** (0–100) and per-pillar scores.
2. **Report** — Generate **alignment report**: strengths, gaps, **primary source of misalignment** (lowest pillar).
3. **Habits** — Assign **Level 1–3 micro-habits** from lowest pillar + optional **segment tags** (e.g. motherhood); store in `active_habits`.
4. **Quarterly reassessment** — Track last assessment date; prompt or allow reassessment every quarter; track progress and gap closure over time.

---

## Part 3: Technical specifications

### 3.1 Database schema (Postgres / Supabase-compatible)

Add to Prisma (or apply equivalent in Supabase). Keep existing `users`, `assessments`, `questions`, `responses`; extend with pillar mapping and new tables.

```prisma
// --- Existing (keep): User, Lead, Assessment, Question, Response, AlignmentIndexScore ---

// Optional: add pillar to Question so each question maps to one pillar
model Question {
  // ... existing fields ...
  pillar   Pillar?  @default(null)  // IDENTITY | PURPOSE | RHYTHMS | ENVIRONMENT
}

enum Pillar {
  IDENTITY
  PURPOSE
  RHYTHMS
  ENVIRONMENT
}

// Per-assessment snapshot: AQ score, pillar scores, primary_domain, report metadata
model AlignmentProfile {
  id           String   @id @default(uuid())
  userId       String
  assessmentId String
  aqScore      Float
  primaryDomain String?  // pillar that is primary source of misalignment (lowest)
  pillarScores Json     // e.g. { "IDENTITY": 72, "PURPOSE": 65, "RHYTHMS": 58, "ENVIRONMENT": 80 }
  createdAt    DateTime @default(now())

  user       User       @relation(...)
  assessment Assessment @relation(...)
  activeHabits ActiveHabit[]
}

// Catalog of habits (Level 1–3, pillar, optional tags)
model Habit {
  id          String   @id @default(uuid())
  title       String
  description String?
  level       Int      // 1, 2, or 3
  pillar      Pillar
  tags        String[] // e.g. ["motherhood", "remote"]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  activeHabits ActiveHabit[]
}

// Assigned habit for a user (from assignment engine)
model ActiveHabit {
  id        String   @id @default(uuid())
  userId    String
  habitId   String
  profileId String?  // which alignment profile triggered this assignment
  assignedAt DateTime @default(now())

  user    User    @relation(...)
  habit   Habit   @relation(...)
  profile AlignmentProfile? @relation(...)
  completions HabitCompletion[]
}

model HabitCompletion {
  id        String   @id @default(uuid())
  activeHabitId String
  completedAt   DateTime @default(now())

  activeHabit ActiveHabit @relation(...)
}
```

- **Relationships**: User → AlignmentProfile, User → ActiveHabit → HabitCompletion; Assessment → AlignmentProfile; Habit → ActiveHabit.
- **Timestamps**: `createdAt` / `updatedAt` on all as above.

### 3.2 AQ Score and primary_domain (TypeScript/JS)

- **Input**: Array of `{ questionId, value, pillar }` (value in scale e.g. 1–5).
- **Pillar score**: For each pillar, average the normalized response values for questions in that pillar, then scale to 0–100 (e.g. same as now: `(normSum / count) * 100`).
- **Overall AQ**:
  - **Normalization**: e.g. per-question norm = (value - min) / (max - min); raw_sum = sum of norms over all questions; if 20 questions, spec says `(raw_sum / 20) * 25` → interpret as scaling so max raw_sum 20 → 100, i.e. **AQ = (raw_sum / 20) * 100** (or keep literal `* 25` if spec is fixed).
  - **Fragmentation penalty**: Reduce AQ when pillar scores are very uneven (e.g. high variance). Example: `penalty = k * variance(pillarScores)`; `AQ_final = AQ_raw - penalty`, clamped 0–100.
- **primary_domain**: Pillar with the **lowest** pillar score (primary source of misalignment).

```ts
// Pseudocode
function computeAQ(
  responses: { questionId: string; value: number; pillar: Pillar }[],
  questionsByPillar: Record<Pillar, { scaleMin: number; scaleMax: number }[]>
): { aqScore: number; pillarScores: Record<Pillar, number>; primaryDomain: Pillar } {
  const pillarScores: Record<Pillar, number> = { ... };
  for (const pillar of PILLARS) {
    const qs = questionsByPillar[pillar];
    const normSum = sum(responses for qs, r => (r.value - min) / (max - min));
    pillarScores[pillar] = (normSum / qs.length) * 100;
  }
  const rawSum = sum(responses, r => normalizedValue(r));
  const aqRaw = (rawSum / 20) * 25; // or (rawSum / 20) * 100
  const variance = variance(Object.values(pillarScores));
  const aqScore = Math.max(0, Math.min(100, aqRaw - fragmentationPenalty(variance)));
  const primaryDomain = pillarWithMinScore(pillarScores);
  return { aqScore, pillarScores, primaryDomain };
}
```

Implement this in backend (e.g. `backend/src/services/aqScore.js` or `.ts`) and call it after storing responses, then store result in `AlignmentProfile` and optionally keep a single overall in `AlignmentIndexScore` for backward compatibility.

### 3.3 Habit assignment engine

- **Input**: `userId`, `alignmentProfileId`, optional `segmentTags: string[]`.
- **Logic**:
  - Select habits where `habit.pillar === profile.primaryDomain` and `habit.level` in 1–3 (e.g. start with 1–2 habits per level or one per level).
  - Optionally filter by `tags` overlapping `segmentTags` (e.g. motherhood).
  - Return list of habit IDs (or full habit objects) and create `ActiveHabit` rows linking `userId`, `habitId`, `profileId`.
- **Output**: JSON array suitable for ActiveHabit table: `[{ habitId, level, pillar, title, ... }]`.

Implement as `assignHabits(profileId, userId, segmentTags?)` in backend; call after creating `AlignmentProfile` on first assessment completion (and optionally on reassessment with new profile).

---

## Part 4: UI components

### 4.1 AQ Score results screen

- **Circular progress**: Total AQ score (0–100), same as current Results circular gauge but labeled “AQ Score” and using spec colors.
- **Four stacked pillar progress bars**: Identity, Purpose, Rhythms, Environment; each bar 0–100; **soft neutral color scheme**: #111111 text, soft grays (e.g. #6b7280, #9ca3af), background #f8f7f4 or similar; **no red/green** (use gray for low, same blue/gray for high if needed).
- **Primary misalignment**: Highlight the **lowest pillar** (e.g. “Primary focus: Rhythms” with short copy: “Your lowest area; we’ve suggested habits to strengthen it.”).
- **Report copy**: Strengths (top 1–2 pillars), gaps (bottom 1–2), and “primary source of misalignment” from `AlignmentProfile`.

### 4.2 Daily dashboard (habits)

- **Section**: “Today’s habits” or “Your micro-habits” showing assigned `ActiveHabit` list for the current user.
- **Per habit**: Title, optional short description, Level badge (1–3), and a **completion** control (e.g. checkmark or “Done”); on submit, create `HabitCompletion` for today.
- **Engaging, not productivity-tool tone**: Short encouraging copy (“Small steps today,” “One habit at a time”) and avoid cold/metric-only language.

### 4.3 Formation transition modal

- **Trigger**: After **14 days of habit completions** OR **AQ &lt; 70** (configurable).
- **Content**: Invitation to the deeper **Simplicity** platform (link to simplicityandproductivity.com or Formation program); emphasize continuity (e.g. “You’ve built a foundation—explore the full program”).
- **Dismiss**: “Remind me later” / “Go to Simplicity”; store dismissal so modal doesn’t show again for X days if desired.

---

## Part 5: Content & messaging

### 5.1 Copy by stage

- **Diagnostic feedback** (post-assessment): Emphasize reflection, not judgment. Example: “Your AQ reflects how aligned your days feel with what matters to you right now. Use it as a starting point, not a grade.”
- **Habit suggestions**: Tie to lowest pillar. Example: “We’ve picked a few small habits focused on [Primary pillar]. Start with one; add more when it feels natural.”
- **Quarterly reassessment**: In-app and/or email: “Time for your quarterly check-in. Retake the assessment to see how your alignment has shifted and update your habits.”
- **Formation program invitation**: “You’ve been building alignment for [14 days] / Your alignment could use deeper support. Explore the Simplicity & Productivity Formation program for guided transformation.”

### 5.2 Business benefits (already partially on Business page; reinforce)

- Goal clarity: One framework so teams and leaders share the same language.
- Transformation tracking: Quarterly reassessment and gap closure over time.
- Employee engagement: Alignment as part of culture and onboarding.
- Long-term alignment: Micro-habits and regular measurement so alignment becomes habit, not a one-off.

---

## Part 6: Step-by-step implementation order

| Step | Module | Actions |
|------|--------|--------|
| **1** | Schema | Add `Pillar` enum; add `pillar` to `Question`; create `AlignmentProfile`, `Habit`, `ActiveHabit`, `HabitCompletion`; run migrations. |
| **2** | Seed | Seed questions with pillar mapping; seed `Habit` catalog (Level 1–3, by pillar, optional tags). |
| **3** | AQ logic | Implement `computeAQ()` (normalization, fragmentation penalty, pillar scores, primary_domain); integrate into submit-assessment flow; create `AlignmentProfile` on submit. |
| **4** | Report API | Add GET `/assessment/report` or extend result to return strengths, gaps, primary_domain, pillar scores. |
| **5** | Habit engine | Implement `assignHabits()`; call after profile creation; add GET `/habits/active`, POST `/habits/complete`. |
| **6** | Results UI | Redesign Results page: AQ circular progress, four pillar bars, primary misalignment block; #111111 + soft grays, no red/green. |
| **7** | Dashboard habits | Add “Today’s habits” section to Dashboard; list active habits and completion control; call completions API. |
| **8** | Formation modal | Add modal component; trigger logic (14 days or AQ &lt; 70); copy and link to Simplicity; dismiss handling. |
| **9** | Content | Drop in diagnostic, habit, quarterly, and Formation copy into Results, Dashboard, and modal. |
| **10** | Business | Ensure Business page and any business-specific flows reference goal clarity, transformation tracking, engagement, long-term alignment. |
| **11** | Quarterly | Done: Dashboard shows a “Quarterly reassessment” card when `daysSinceLastAssessment >= 90` with copy and CTA to take the assessment; Results page “How to use it” includes quarterly reassessment instructions. |

---

## Part 7: File-level checklist

- **Backend**: `prisma/schema.prisma` (schema); `src/services/aqScore.js` (or `.ts`); `src/services/habitAssignment.js`; `src/controllers/assessmentController.js` (integrate AQ + profile); `src/routes/habits.js`; `src/controllers/habitController.js`; seed habits + question pillars.
- **Frontend**: `ResultsPage.jsx` (AQ + pillars + primary misalignment + colors); `DashboardPage.jsx` (habits section); `FormationModal.jsx` (or inline in Layout); copy in `constants/copy.js` or per-page.
- **Content**: Single source for diagnostic, habit, quarterly, Formation, and business-benefit copy (doc or constants).

---

## Summary

- **Done**: Users, assessments, single score, results (circular + message), dashboard (gauge + trend), Business journey copy, pricing/shop.
- **To build**: Four pillars + AQ formula + fragmentation penalty; `AlignmentProfile` + report (strengths, gaps, primary_domain); `Habit` catalog + `ActiveHabit` + `HabitCompletion`; habit assignment engine; AQ results UI (pillar bars, neutral palette); daily habits on dashboard; Formation modal; full copy set; quarterly reassessment flow.

Using this plan as a single reference, you can implement the Alignment OS module end-to-end for both individuals and businesses.
