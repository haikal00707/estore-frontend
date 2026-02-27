import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../assets/services/api';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchWishlist = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        setLoading(true);
        try {
            const res = await API.get('/wishlist');
            setWishlist(res.data);
        } catch (err) {
            console.error('Error fetching wishlist:', err);
        } finally {
            setLoading(false);
        }
    };

    const addToWishlist = async (productId) => {
        try {
            const res = await API.post('/wishlist', { product_id: productId });
            setWishlist(res.data.wishlist);
            return true;
        } catch (err) {
            console.error('Error adding to wishlist:', err);
            return false;
        }
    };

    const removeFromWishlist = async (itemId) => {
        try {
            const res = await API.delete(`/wishlist/${itemId}`);
            setWishlist(res.data.wishlist);
        } catch (err) {
            console.error('Error removing from wishlist:', err);
        }
    };

    const isInWishlist = (productId) => {
        return wishlist?.items?.some(item => item.product_id === productId);
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    return (
        <WishlistContext.Provider value={{ wishlist, loading, addToWishlist, removeFromWishlist, isInWishlist, fetchWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
