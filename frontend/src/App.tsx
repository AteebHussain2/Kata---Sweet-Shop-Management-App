

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function PrivateRoute({ children }: { children: JSX.Element }) {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
}

import { Toaster } from 'sonner';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <Toaster position="top-right" richColors closeButton />
        </Router>
    )
}

export default App
