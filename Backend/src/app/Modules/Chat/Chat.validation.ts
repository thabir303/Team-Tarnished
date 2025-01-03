import { z } from 'zod';

const addChatSchema = z.object({
  body: z.object({
    prompt: z.string(),
    // file: z
    //   .instanceof(File)
    //   .optional(), 
    file: z.any().optional(),
  }),
});

export const ChatValidation = {
  addChatSchema,
};