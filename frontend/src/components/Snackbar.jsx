import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import './Snackbar.css';

const SnackbarContext = createContext(null);

export function SnackbarProvider({ children }) {
    const [snacks, setSnacks] = useState([]);

    const showSnackbar = useCallback((message, type = 'success', duration = 3500) => {
        const id = Date.now();
        setSnacks(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setSnacks(prev => prev.filter(s => s.id !== id));
        }, duration);
    }, []);

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <div className="snackbar-container">
                {snacks.map(snack => (
                    <div key={snack.id} className={`snackbar snackbar-${snack.type}`}>
                        <span className="snackbar-icon">
                            {snack.type === 'success' ? '✓' : snack.type === 'error' ? '✕' : 'ℹ'}
                        </span>
                        <span className="snackbar-message">{snack.message}</span>
                        <button
                            className="snackbar-close"
                            onClick={() => setSnacks(prev => prev.filter(s => s.id !== snack.id))}
                        >×</button>
                    </div>
                ))}
            </div>
        </SnackbarContext.Provider>
    );
}

export const useSnackbar = () => useContext(SnackbarContext);
