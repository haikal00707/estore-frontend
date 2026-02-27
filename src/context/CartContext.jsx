import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../assets/services/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        setLoading(true);
        try {
            const res = await API.get('/cart');
            setCart(res.data);
        } catch (err) {
            console.error('Error fetching cart:', err);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        try {
            console.log('Attempting to add to bag:', { productId, quantity });
            const res = await API.post('/cart', { product_id: productId, quantity });
            console.log('Add to bag response:', res.data);
            setCart(res.data.cart);
            return true;
        } catch (err) {
            console.error('Error adding to bag:', err);
            if (err.response) {
                console.error('Error response data:', err.response.data);
                console.error('Error response status:', err.response.status);
            }
            alert(`FAILED TO ADD ITEM: ${err.response?.data?.message || err.message}`);
            return false;
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        try {
            const res = await API.put(`/cart/${itemId}`, { quantity });
            setCart(res.data.cart);
        } catch (err) {
            console.error('Error updating cart:', err);
            alert('Failed to update quantity.');
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            const res = await API.delete(`/cart/${itemId}`);
            setCart(res.data.cart);
        } catch (err) {
            console.error('Error removing from cart:', err);
        }
    };

    const clearCart = async () => {
        try {
            await API.delete('/cart-clear');
            setCart({ ...cart, items: [] });
        } catch (err) {
            console.error('Error clearing cart:', err);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};
