import { api } from '@/lib/api';
import type { Todo, CreateTodoInput, UpdateTodoInput, TodosResponse } from '@/types/todo';
import { mockTodosResponse, mockTodos } from '@/data/mockData';

export const getTodos = async (): Promise<TodosResponse> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        return new Promise(resolve => {
            setTimeout(() => resolve(mockTodosResponse), 800);
        });
    }

    const response = await api.get<TodosResponse>('/todos');
    return response.data;
};

export const createTodo = async (data: CreateTodoInput): Promise<Todo> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        const newTodo: Todo = {
            id: Date.now().toString(),
            title: data.title,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        return new Promise(resolve => {
            setTimeout(() => resolve(newTodo), 500);
        });
    }

    const response = await api.post<Todo>('/todos', data);
    return response.data;
};

export const updateTodo = async (id: string, data: UpdateTodoInput): Promise<Todo> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        const existingTodo = mockTodos.find(todo => todo.id === id);
        if (!existingTodo) {
            throw new Error('Todo not found');
        }

        const updatedTodo: Todo = {
            ...existingTodo,
            ...data,
            updatedAt: new Date().toISOString()
        };

        return new Promise(resolve => {
            setTimeout(() => resolve(updatedTodo), 500);
        });
    }

    const response = await api.put<Todo>(`/todos/${id}`, data);
    return response.data;
};

export const deleteTodo = async (id: string): Promise<void> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        return new Promise(resolve => {
            setTimeout(() => resolve(), 500);
        });
    }

    await api.delete(`/todos/${id}`);
};
