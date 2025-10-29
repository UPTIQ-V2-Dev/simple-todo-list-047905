import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { TodoListPage } from '@/pages/TodoListPage';

export const App = () => {
    return (
        <Router>
            <div className='min-h-screen bg-background'>
                <Header />
                <main>
                    <Routes>
                        <Route
                            path='/'
                            element={<TodoListPage />}
                        />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};
