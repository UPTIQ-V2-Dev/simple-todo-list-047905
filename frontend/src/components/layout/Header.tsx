import { CheckSquare } from 'lucide-react';

export const Header = () => {
    return (
        <header className='border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50'>
            <div className='container flex h-16 items-center'>
                <div className='flex items-center gap-2'>
                    <CheckSquare className='h-6 w-6 text-primary' />
                    <h1 className='text-xl font-semibold'>Simple Todo List</h1>
                </div>
            </div>
        </header>
    );
};
