import { z } from 'zod';

const addPDFSchema = z.object({
  body: z.object({
    caption: z.string(), 
    content: z.string(),
    user: z.string(),
    transparency: z.enum(['public', 'private'])
  }),
});

export const PDFValidation = {
  addPDFSchema,
};