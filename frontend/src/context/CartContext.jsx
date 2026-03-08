import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const [cart, setCart] = useState({ items: [], total_price: 0, total_items: 0 });
    const [loading, setLoading] = useState(false);

    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) {
            setCart({ items: [], total_price: 0, total_items: 0 });
            return;
        }
        try {
            setLoading(true);
            const { data } = await API.get('/cart/');
            setCart(data);
        } catch {
            // silent fail
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (productId, quantity = 1, size = '', color = '') => {
        const { data } = await API.post('/cart/add/', {
            product_id: productId, quantity, size, color,
        });
        setCart(data);
    };

    const updateItem = async (itemId, quantity) => {
        const { data } = await API.put(`/cart/update/${itemId}/`, { quantity });
        setCart(data);
    };

    const removeItem = async (itemId) => {
        const { data } = await API.delete(`/cart/remove/${itemId}/`);
        setCart(data);
    };

    const clearCart = async () => {
        const { data } = await API.delete('/cart/clear/');
        setCart(data);
    };

    return (
        <CartContext.Provider value={{
            cart, loading, fetchCart, addToCart, updateItem, removeItem, clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
