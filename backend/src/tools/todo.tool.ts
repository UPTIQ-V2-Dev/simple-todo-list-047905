import { todoService } from '../services/index.ts';
import { MCPTool } from '../types/mcp.ts';
import pick from '../utils/pick.ts';
import { z } from 'zod';

const todoSchema = z.object({
    id: z.string(),
    title: z.string(),
    completed: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
    userId: z.number()
});

const createTodoTool: MCPTool = {
    id: 'todo_create',
    name: 'Create Todo',
    description: 'Create a new todo item',
    inputSchema: z.object({
        title: z.string().min(1),
        userId: z.number().int()
    }),
    outputSchema: todoSchema,
    fn: async (inputs: { title: string; userId: number }) => {
        const result = await todoService.createTodo(inputs.title, inputs.userId);
        return result;
    }
};

const getTodosTool: MCPTool = {
    id: 'todo_get_all',
    name: 'Get All Todos',
    description: 'Get all todos for a user',
    inputSchema: z.object({
        userId: z.number().int()
    }),
    outputSchema: z.object({
        todos: z.array(todoSchema),
        total: z.number()
    }),
    fn: async (inputs: { userId: number }) => {
        const result = await todoService.getTodosByUserId(inputs.userId);
        return result;
    }
};

const getTodoTool: MCPTool = {
    id: 'todo_get_by_id',
    name: 'Get Todo By ID',
    description: 'Get a single todo by ID for a specific user',
    inputSchema: z.object({
        todoId: z.string(),
        userId: z.number().int()
    }),
    outputSchema: z.object({
        todo: todoSchema.optional(),
        found: z.boolean()
    }),
    fn: async (inputs: { todoId: string; userId: number }) => {
        const result = await todoService.getTodoByIdAndUserId(inputs.todoId, inputs.userId);
        return {
            todo: result || undefined,
            found: !!result
        };
    }
};

const updateTodoTool: MCPTool = {
    id: 'todo_update',
    name: 'Update Todo',
    description: 'Update a todo by ID for a specific user',
    inputSchema: z.object({
        todoId: z.string(),
        userId: z.number().int(),
        title: z.string().optional(),
        completed: z.boolean().optional()
    }),
    outputSchema: todoSchema,
    fn: async (inputs: { todoId: string; userId: number; title?: string; completed?: boolean }) => {
        const updateData = pick(inputs, ['title', 'completed']);
        const result = await todoService.updateTodoByIdAndUserId(inputs.todoId, inputs.userId, updateData);
        return result;
    }
};

const deleteTodoTool: MCPTool = {
    id: 'todo_delete',
    name: 'Delete Todo',
    description: 'Delete a todo by ID for a specific user',
    inputSchema: z.object({
        todoId: z.string(),
        userId: z.number().int()
    }),
    outputSchema: z.object({
        success: z.boolean()
    }),
    fn: async (inputs: { todoId: string; userId: number }) => {
        await todoService.deleteTodoByIdAndUserId(inputs.todoId, inputs.userId);
        return { success: true };
    }
};

export const todoTools: MCPTool[] = [createTodoTool, getTodosTool, getTodoTool, updateTodoTool, deleteTodoTool];
