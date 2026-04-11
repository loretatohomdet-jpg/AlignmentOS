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

module.exports = {
  submitAssessmentSchema,
};

