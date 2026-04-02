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

    const login = (data) => {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        // data processing if any
        api.get('auth/me/').then(res => {
            setUser(res.data);
        }).catch(() => {});
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
