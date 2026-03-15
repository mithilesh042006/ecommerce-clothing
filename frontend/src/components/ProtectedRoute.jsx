import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    if (!isAuthenticated) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    return children;
}

export function AdminRoute({ children }) {
    const { isAuthenticated, isAdmin } = useAuth();
    const location = useLocation();
    if (!isAuthenticated) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    if (!isAdmin) return <Navigate to="/" replace />;
    return children;
}

// Forces admin users to stay on /admin — redirects them back if they navigate away
export function AdminLock({ children }) {
    const { isAuthenticated, isAdmin } = useAuth();
    const location = useLocation();
    if (isAuthenticated && isAdmin && location.pathname !== '/admin') {
        return <Navigate to="/admin" replace />;
    }
    return children;
}
