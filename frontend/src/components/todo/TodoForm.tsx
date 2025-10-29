import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { todoFormSchema, type TodoFormData } from '@/lib/todoValidation';

interface TodoFormProps {
    onSubmit: (data: TodoFormData) => Promise<void>;
    isLoading?: boolean;
    initialValue?: string;
    onCancel?: () => void;
    placeholder?: string;
    submitText?: string;
    showCancel?: boolean;
}

export const TodoForm = ({
    onSubmit,
    isLoading = false,
    initialValue = '',
    onCancel,
    placeholder = 'Enter todo title...',
    submitText = 'Add Todo',
    showCancel = false
}: TodoFormProps) => {
    const [isExpanded, setIsExpanded] = useState(!!initialValue || showCancel);

    const form = useForm<TodoFormData>({
        resolver: zodResolver(todoFormSchema),
        defaultValues: {
            title: initialValue
        }
    });

    const handleSubmit = async (data: TodoFormData) => {
        try {
            await onSubmit(data);
            form.reset();
            if (!showCancel) {
                setIsExpanded(false);
            }
        } catch {
            // Error handled by the hook
        }
    };

    const handleCancel = () => {
        form.reset();
        if (onCancel) {
            onCancel();
        } else {
            setIsExpanded(false);
        }
    };

    if (!isExpanded && !showCancel) {
        return (
            <div className='mb-6'>
                <Button
                    onClick={() => setIsExpanded(true)}
                    variant='outline'
                    className='w-full justify-start text-muted-foreground hover:text-foreground'
                >
                    <Plus className='h-4 w-4 mr-2' />
                    {placeholder}
                </Button>
            </div>
        );
    }

    return (
        <div className='mb-6'>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className='space-y-3'
                >
                    <FormField
                        control={form.control}
                        name='title'
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder={placeholder}
                                        autoFocus={isExpanded}
                                        disabled={isLoading}
                                        className='w-full'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='flex gap-2'>
                        <Button
                            type='submit'
                            disabled={isLoading}
                            className='flex-1'
                        >
                            {isLoading ? 'Saving...' : submitText}
                        </Button>
                        {(showCancel || isExpanded) && (
                            <Button
                                type='button'
                                variant='outline'
                                onClick={handleCancel}
                                disabled={isLoading}
                            >
                                <X className='h-4 w-4' />
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </div>
    );
};
