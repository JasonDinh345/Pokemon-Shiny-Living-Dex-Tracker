'use client';
import axios from 'axios';
import React, {useState, useEffect, createContext, useContext} from 'react';

type AuthContextType = {
    login: (data: {email: string; password: string}) => void;
    logout: () => void;
    user?: {email: string; username: string};
    error: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [user, setUser] = useState<{email: string; username: string}>();
    const [error, setError] = useState<string>('');

    useEffect(() => {
        async function authUser() {
            try {
                const res = await axios.post('/auth/token');
                setUser(res.data);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    setError(`Please login again!`);
                } else {
                    throw error;
                }
            }
        }
        authUser();
    }, []);

    const login = async (data: {email: string; password: string}) => {
        try {
            const res = await axios.post('/auth/login', data);
            setUser(res.data);
        } catch {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data.error);
            } else {
                setError(`Something went wrong!`);
            }
        }
    };

    const logout = async () => {
        try {
            await axios.post('/auth/logout');
            setUser(undefined);
        } catch {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data.error);
            } else {
                setError(`Something went wrong!`);
            }
        }
    };

    return (
        <AuthContext.Provider value={{login, logout, user, error}}>{children}</AuthContext.Provider>
    );
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
