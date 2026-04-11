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
  role: RoleEnum.optional(),
  plan: PlanEnum.optional(),
  /** true = suspend now, false = lift suspension */
  suspended: z.boolean().optional(),
});

const adminCreateNoteSchema = z.object({
  body: z.string().min(1).max(10000),
});

const adminUpdateAssessmentSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  description: z.string().max(5000).nullable().optional(),
  isActive: z.boolean().optional(),
});

const adminUpdateQuestionSchema = z.object({
  text: z.string().min(1).max(2000).optional(),
  order: z.number().int().min(0).optional(),
  scaleMin: z.number().int().optional(),
  scaleMax: z.number().int().optional(),
  pillar: PillarEnum.optional(),
  questionType: QuestionTypeEnum.optional(),
});

module.exports = {
  adminUpdateUserSchema,
  adminCreateNoteSchema,
  adminUpdateAssessmentSchema,
  adminUpdateQuestionSchema,
};
