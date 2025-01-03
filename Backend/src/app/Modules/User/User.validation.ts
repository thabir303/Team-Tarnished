import { z } from 'zod';

const addUserSchema = z.object({
    body: z.object({
        email: z.string().email(),
        name: z.string(),
        phone: z.string(),
        password: z.string().optional(),
        role: z.enum(['admin', 'editor']).optional()
    })
})

const updateUserSchema = z.object({
    body: z.object({
        password: z.string().optional(),
        role: z.enum(['admin', 'editor'])
    })
})

export const UserValidation = {
    addUserSchema,
    updateUserSchema
}