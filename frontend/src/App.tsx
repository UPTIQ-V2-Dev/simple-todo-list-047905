import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { TodoListPage } from '@/pages/TodoListPage';
import { LoginPage } from '@/pages/LoginPage';

export const App = () => {
    return (
        <Router>
            <div className='min-h-screen bg-background'>
                <Header />
                <main>
                    <Routes>
                        <Route
                            path='/login'
                            element={<LoginPage />}
                        />
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
