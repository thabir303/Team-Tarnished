import { z } from 'zod';

const addTestSchema = z.object({
  body: z.object({ 
    accepted: z.boolean().optional(),
    user: z.string(),
  }),
});

export const TestValidation = {
  addTestSchema,
};