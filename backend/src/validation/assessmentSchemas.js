const { z } = require('zod');

const submitAssessmentSchema = z.object({
  assessmentId: z.string().uuid(),
  responses: z
    .array(
      z.object({
        questionId: z.string().uuid(),
        value: z.number().int(),
      })
    )
    .min(1),
});

const emailReportSchema = z.object({
  email: z.string().email(),
  source: z.string().max(100).optional(),
  assessmentId: z.string().uuid().optional(),
  responses: z
    .array(
      z.object({
        questionId: z.string().uuid(),
        value: z.number().int(),
      })
    )
    .min(1)
    .optional(),
});

module.exports = {
  submitAssessmentSchema,
  emailReportSchema,
};

