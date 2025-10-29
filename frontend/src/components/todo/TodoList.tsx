import { useTodos, useCreateTodo, useUpdateTodo, useDeleteTodo } from '@/hooks/useTodos';
import { TodoForm } from './TodoForm';
import { TodoItem } from './TodoItem';
import { EmptyState } from './EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { TodoFormData } from '@/lib/todoValidation';

export const TodoList = () => {
    const { data, isLoading, error } = useTodos();
    const createTodoMutation = useCreateTodo();
    const updateTodoMutation = useUpdateTodo();
    const deleteTodoMutation = useDeleteTodo();

    const handleCreateTodo = async (formData: TodoFormData) => {
        await createTodoMutation.mutateAsync({ title: formData.title });
    };

    const handleToggleTodo = (id: string, completed: boolean) => {
        updateTodoMutation.mutate({ id, data: { completed } });
    };

    const handleUpdateTodo = (id: string, title: string) => {
        updateTodoMutation.mutate({ id, data: { title } });
    };

    const handleDeleteTodo = (id: string) => {
        deleteTodoMutation.mutate(id);
    };

    if (error) {
        return (
            <div className='space-y-4'>
                <Alert variant='destructive'>
                    <AlertDescription>Failed to load todos. Please try again later.</AlertDescription>
                </Alert>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className='space-y-4'>
                <div className='space-y-3'>
                    <Skeleton className='h-10 w-full' />
                    <Skeleton className='h-4 w-32' />
                </div>
                <div className='space-y-3'>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className='border rounded-lg p-4'
                        >
                            <div className='flex items-center gap-3'>
                                <Skeleton className='h-4 w-4' />
                                <div className='flex-1 space-y-2'>
                                    <Skeleton className='h-4 w-3/4' />
                                    <Skeleton className='h-3 w-1/2' />
                                </div>
                                <div className='flex gap-1'>
                                    <Skeleton className='h-8 w-8' />
                                    <Skeleton className='h-8 w-8' />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const todos = data?.todos || [];
    const hasTodos = todos.length > 0;

    if (!hasTodos) {
        return (
            <div className='space-y-6'>
                <TodoForm
                    onSubmit={handleCreateTodo}
                    isLoading={createTodoMutation.isPending}
                />
                <EmptyState onAddTodo={() => {}} />
            </div>
        );
    }

    // Sort todos: incomplete first, then by creation date (newest first)
    const sortedTodos = [...todos].sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const completedCount = todos.filter(todo => todo.completed).length;
    const totalCount = todos.length;

    return (
        <div className='space-y-6'>
            <TodoForm
                onSubmit={handleCreateTodo}
                isLoading={createTodoMutation.isPending}
            />

            <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                    <h2 className='text-lg font-semibold'>Your Todos</h2>
                    <span className='text-sm text-muted-foreground'>
                        {completedCount} of {totalCount} completed
                    </span>
                </div>

                <div className='space-y-3'>
                    {sortedTodos.map(todo => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            onToggle={handleToggleTodo}
                            onUpdate={handleUpdateTodo}
                            onDelete={handleDeleteTodo}
                            isUpdating={updateTodoMutation.isPending}
                            isDeleting={deleteTodoMutation.isPending}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
