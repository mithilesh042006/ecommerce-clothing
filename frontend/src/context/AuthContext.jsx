import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });
    const [loading, setLoading] = useState(false);

    const isAuthenticated = !!user;
    const isAdmin = user?.is_staff || false;

    const login = async (username, password) => {
        const { data } = await API.post('/auth/login/', { username, password });
        localStorage.setItem('tokens', JSON.stringify(data));
        // Fetch user profile
        const profile = await API.get('/auth/profile/');
        localStorage.setItem('user', JSON.stringify(profile.data));
        setUser(profile.data);
        return profile.data;
    };

    const register = async (userData) => {
        await API.post('/auth/register/', userData);
        // Auto-login after register
        return login(userData.username, userData.password);
    };

    const logout = () => {
        localStorage.removeItem('tokens');
        localStorage.removeItem('user');
        setUser(null);
    };

    const refreshProfile = async () => {
        try {
            const { data } = await API.get('/auth/profile/');
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
        } catch {
            logout();
        }
    };

    return (
        <AuthContext.Provider value={{
            user, isAuthenticated, isAdmin, loading,
            login, register, logout, refreshProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
