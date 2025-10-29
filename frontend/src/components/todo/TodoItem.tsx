import { useState } from 'react';
import { format } from 'date-fns';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import type { Todo } from '@/types/todo';
import { cn } from '@/lib/utils';

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: string, completed: boolean) => void;
    onUpdate: (id: string, title: string) => void;
    onDelete: (id: string) => void;
    isUpdating?: boolean;
    isDeleting?: boolean;
}

export const TodoItem = ({
    todo,
    onToggle,
    onUpdate,
    onDelete,
    isUpdating = false,
    isDeleting = false
}: TodoItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(todo.title);

    const handleSaveEdit = () => {
        if (editValue.trim() && editValue !== todo.title) {
            onUpdate(todo.id, editValue.trim());
        }
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setEditValue(todo.title);
        setIsEditing(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSaveEdit();
        } else if (e.key === 'Escape') {
            handleCancelEdit();
        }
    };

    return (
        <Card className={cn('p-4 transition-opacity', isDeleting && 'opacity-50')}>
            <div className='flex items-center gap-3'>
                <Checkbox
                    checked={todo.completed}
                    onCheckedChange={checked => onToggle(todo.id, !!checked)}
                    disabled={isUpdating || isDeleting}
                />

                <div className='flex-1 min-w-0'>
                    {isEditing ? (
                        <div className='flex items-center gap-2'>
                            <Input
                                value={editValue}
                                onChange={e => setEditValue(e.target.value)}
                                onKeyDown={handleKeyPress}
                                autoFocus
                                disabled={isUpdating}
                                className='flex-1'
                            />
                            <Button
                                size='sm'
                                onClick={handleSaveEdit}
                                disabled={isUpdating || !editValue.trim()}
                            >
                                <Check className='h-4 w-4' />
                            </Button>
                            <Button
                                size='sm'
                                variant='outline'
                                onClick={handleCancelEdit}
                                disabled={isUpdating}
                            >
                                <X className='h-4 w-4' />
                            </Button>
                        </div>
                    ) : (
                        <div className='space-y-1'>
                            <p
                                className={cn(
                                    'text-sm font-medium transition-colors',
                                    todo.completed && 'line-through text-muted-foreground'
                                )}
                            >
                                {todo.title}
                            </p>
                            <p className='text-xs text-muted-foreground'>
                                Created {format(new Date(todo.createdAt), 'MMM d, yyyy')}
                                {todo.updatedAt !== todo.createdAt && (
                                    <span> • Updated {format(new Date(todo.updatedAt), 'MMM d, yyyy')}</span>
                                )}
                            </p>
                        </div>
                    )}
                </div>

                {!isEditing && (
                    <div className='flex items-center gap-1'>
                        <Button
                            size='sm'
                            variant='ghost'
                            onClick={() => setIsEditing(true)}
                            disabled={isUpdating || isDeleting}
                        >
                            <Edit2 className='h-4 w-4' />
                        </Button>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    size='sm'
                                    variant='ghost'
                                    disabled={isUpdating || isDeleting}
                                    className='text-destructive hover:text-destructive'
                                >
                                    <Trash2 className='h-4 w-4' />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Todo</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete &quot;{todo.title}&quot;? This action cannot be
                                        undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => onDelete(todo.id)}
                                        className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )}
            </div>
        </Card>
    );
};
