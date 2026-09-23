const { z } = require('zod');

const RoleEnum = z.enum(['USER', 'ADMIN']);
const PlanEnum = z.enum(['FREE', 'PRO', 'TEAM']);
const PillarEnum = z.enum([
  'IDENTITY',
  'PURPOSE',
  'MINDSET',
  'HABITS',
  'ENVIRONMENT',
  'EXECUTION',
]);
const QuestionTypeEnum = z.enum(['STANDARD', 'PENALTY']);

const adminUpdateUserSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  role: RoleEnum.optional(),
  plan: PlanEnum.optional(),
  /** true = suspend now, false = lift suspension */
  suspended: z.boolean().optional(),
});

const adminCreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(200),
  password: z.string().min(6).max(200),
  role: RoleEnum.optional().default('USER'),
  plan: PlanEnum.optional().default('FREE'),
});

const adminCreateNoteSchema = z.object({
  body: z.string().min(1).max(10000),
});

const adminUpdateAssessmentSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  description: z.string().max(5000).nullable().optional(),
  isActive: z.boolean().optional(),
});

const adminCreateAssessmentSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().max(5000).optional().nullable(),
  isActive: z.boolean().optional().default(true),
});

const adminUpdateQuestionSchema = z.object({
  text: z.string().min(1).max(2000).optional(),
  order: z.number().int().min(0).optional(),
  scaleMin: z.number().int().optional(),
  scaleMax: z.number().int().optional(),
  pillar: PillarEnum.optional(),
  questionType: QuestionTypeEnum.optional(),
});

const adminCreateQuestionSchema = z.object({
  text: z.string().min(1).max(2000),
  pillar: PillarEnum,
  questionType: QuestionTypeEnum.optional().default('STANDARD'),
  order: z.number().int().min(0).optional(),
  scaleMin: z.number().int().optional().default(1),
  scaleMax: z.number().int().optional().default(5),
});

const adminCreateLeadSchema = z.object({
  email: z.string().email(),
  source: z.string().max(200).optional().nullable(),
});

const adminUpdateLeadSchema = z.object({
  email: z.string().email().optional(),
  source: z.string().max(200).optional().nullable(),
});

const adminPageFields = {
  title: z.string().min(1).max(200),
  path: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(80).optional(),
  pageGroup: z.string().min(1).max(40).optional(),
  eyebrow: z.string().max(200).optional().nullable(),
  headline: z.string().max(500).optional().nullable(),
  subhead: z.string().max(500).optional().nullable(),
  body: z.string().max(20000).optional().nullable(),
  ctaLabel: z.string().max(120).optional().nullable(),
  ctaHref: z.string().max(500).optional().nullable(),
  sections: z.record(z.string(), z.string().max(5000)).optional().nullable(),
  isPublished: z.boolean().optional(),
};

const adminCreatePageSchema = z.object(adminPageFields);
const adminUpdatePageSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  path: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(80).optional(),
  pageGroup: z.string().min(1).max(40).optional(),
  eyebrow: z.string().max(200).optional().nullable(),
  headline: z.string().max(500).optional().nullable(),
  subhead: z.string().max(500).optional().nullable(),
  body: z.string().max(20000).optional().nullable(),
  ctaLabel: z.string().max(120).optional().nullable(),
  ctaHref: z.string().max(500).optional().nullable(),
  sections: z.record(z.string(), z.string().max(5000)).optional().nullable(),
  isPublished: z.boolean().optional(),
});

const adminCreateShopSchema = z.object({
  sku: z.string().min(1).max(80).optional(),
  name: z.string().min(1).max(200),
  path: z.string().min(1).max(200),
  kicker: z.string().max(80).optional().nullable(),
  tagline: z.string().max(300).optional().nullable(),
  body: z.string().max(5000).optional().nullable(),
  image: z.string().max(500).optional().nullable(),
  digitalPrice: z.number().int().min(0).optional().nullable(),
  printPrice: z.number().int().min(0).optional().nullable(),
  digitalUrl: z.string().max(1000).optional().nullable(),
  printUrl: z.string().max(1000).optional().nullable(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

const adminUpdateShopSchema = adminCreateShopSchema.partial();

const adminCreateHabitSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  level: z.number().int().min(1).max(9).optional().default(1),
  pillar: PillarEnum,
  tags: z.array(z.string().max(80)).optional().default([]),
});

const adminUpdateHabitSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional().nullable(),
  level: z.number().int().min(1).max(9).optional(),
  pillar: PillarEnum.optional(),
  tags: z.array(z.string().max(80)).optional(),
});

module.exports = {
  adminUpdateUserSchema,
  adminCreateUserSchema,
  adminCreateNoteSchema,
  adminUpdateAssessmentSchema,
  adminCreateAssessmentSchema,
  adminUpdateQuestionSchema,
  adminCreateQuestionSchema,
  adminCreateLeadSchema,
  adminUpdateLeadSchema,
  adminCreatePageSchema,
  adminUpdatePageSchema,
  adminCreateShopSchema,
  adminUpdateShopSchema,
  adminCreateHabitSchema,
  adminUpdateHabitSchema,
};
