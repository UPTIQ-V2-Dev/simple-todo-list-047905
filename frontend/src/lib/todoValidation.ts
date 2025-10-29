import { z } from 'zod';

export const todoFormSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters').trim()
});

export const createTodoSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters').trim()
});

export const updateTodoSchema = z
    .object({
        title: z
            .string()
            .min(1, 'Title is required')
            .max(200, 'Title must be less than 200 characters')
            .trim()
            .optional(),
        completed: z.boolean().optional()
    })
    .refine(data => data.title !== undefined || data.completed !== undefined, 'At least one field must be provided');

export type TodoFormData = z.infer<typeof todoFormSchema>;
export type CreateTodoData = z.infer<typeof createTodoSchema>;
export type UpdateTodoData = z.infer<typeof updateTodoSchema>;
