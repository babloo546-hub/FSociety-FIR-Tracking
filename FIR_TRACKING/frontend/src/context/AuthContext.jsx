import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (localStorage.getItem('access_token')) {
                try {
                    const response = await api.get('auth/me/');
                    setUser(response.data);
                } catch (error) {
                    logout();
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await api.post('auth/login/', credentials);
            const { access, refresh } = response.data;
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            
            const userResponse = await api.get('auth/me/');
            setUser(userResponse.data);
            return userResponse.data;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
