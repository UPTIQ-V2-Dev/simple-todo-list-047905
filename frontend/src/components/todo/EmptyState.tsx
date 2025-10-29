import { CheckSquare, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
    onAddTodo: () => void;
}

export const EmptyState = ({ onAddTodo }: EmptyStateProps) => {
    return (
        <div className='flex flex-col items-center justify-center py-12 px-4'>
            <div className='mb-6'>
                <CheckSquare className='h-16 w-16 text-muted-foreground/50' />
            </div>
            <h3 className='text-lg font-semibold mb-2'>No todos yet</h3>
            <p className='text-muted-foreground text-center mb-6 max-w-sm'>
                Get started by creating your first todo. Stay organized and track your tasks efficiently.
            </p>
            <Button
                onClick={onAddTodo}
                className='flex items-center gap-2'
            >
                <Plus className='h-4 w-4' />
                Add your first todo
            </Button>
        </div>
    );
};
