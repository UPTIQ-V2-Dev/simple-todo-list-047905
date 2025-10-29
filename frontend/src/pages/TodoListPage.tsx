import { TodoList } from '@/components/todo/TodoList';

export const TodoListPage = () => {
    return (
        <div className='container max-w-2xl mx-auto py-8 px-4'>
            <div className='space-y-8'>
                <div className='text-center'>
                    <h1 className='text-3xl font-bold mb-2'>My Todo List</h1>
                    <p className='text-muted-foreground'>Stay organized and track your tasks efficiently</p>
                </div>

                <TodoList />
            </div>
        </div>
    );
};
