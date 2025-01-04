import { z } from 'zod';

const addTestSchema = z.object({
  body: z.object({ 
    accepted: z.boolean().optional(),
  }),
});

export const TestValidation = {
  addTestSchema,
};