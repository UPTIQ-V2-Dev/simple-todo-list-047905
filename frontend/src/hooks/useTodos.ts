import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTodos, createTodo, updateTodo, deleteTodo } from '@/services/todoApi';
import type { UpdateTodoInput, Todo } from '@/types/todo';
import { toast } from 'sonner';

const TODOS_QUERY_KEY = ['todos'];

export const useTodos = () => {
    return useQuery({
        queryKey: TODOS_QUERY_KEY,
        queryFn: getTodos
    });
};

export const useCreateTodo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTodo,
        onSuccess: (newTodo: Todo) => {
            queryClient.setQueryData(TODOS_QUERY_KEY, (oldData: any) => {
                if (!oldData) return { todos: [newTodo], total: 1 };
                return {
                    todos: [newTodo, ...oldData.todos],
                    total: oldData.total + 1
                };
            });
            toast.success('Todo created successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to create todo');
        }
    });
};

export const useUpdateTodo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateTodoInput }) => updateTodo(id, data),
        onSuccess: (updatedTodo: Todo) => {
            queryClient.setQueryData(TODOS_QUERY_KEY, (oldData: any) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    todos: oldData.todos.map((todo: Todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
                };
            });
            toast.success('Todo updated successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update todo');
        }
    });
};

export const useDeleteTodo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTodo,
        onSuccess: (_, todoId: string) => {
            queryClient.setQueryData(TODOS_QUERY_KEY, (oldData: any) => {
                if (!oldData) return oldData;
                return {
                    todos: oldData.todos.filter((todo: Todo) => todo.id !== todoId),
                    total: oldData.total - 1
                };
            });
            toast.success('Todo deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to delete todo');
        }
    });
};
