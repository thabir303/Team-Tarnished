import { z } from 'zod';

const addChatSchema = z.object({
  body: z.object({
    prompt: z.string(), 
    // file: z.any().optional(),
    extractedText: z.string().optional(),
    user: z.string(),
  }),
});

export const ChatValidation = {
  addChatSchema,
};