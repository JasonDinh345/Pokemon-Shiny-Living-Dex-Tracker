'use client';

import api from '@/lib/axios';
import {errorToast, successToast} from '@/util/toast';
import axios from 'axios';
import {useRouter} from 'next/navigation';
import React, {useState, useEffect, createContext, useContext} from 'react';

type AuthContextType = {
    login: (data: {email: string; password: string}) => void;
    logout: () => void;
    user?: {email: string; username: string};

    register: (data: {email: string; password: string; username: string}) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [user, setUser] = useState<{email: string; username: string}>();

    useEffect(() => {
        async function authUser() {
            try {
                const res = await api.post('/auth/token');
                setUser(res.data);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    errorToast(`Please login again!`);
                } else {
                    throw error;
                }
            }
        }
        authUser();
    }, []);
    const register = async (data: {email: string; password: string; username: string}) => {
        await api.post('/auth/register', data);
        successToast('Successfully registered user!', 'Check your email for verification!');
    };
    const login = async (data: {email: string; password: string}) => {
        const res = await api.post('/auth/login', data);
        setUser(res.data);
    };

    const logout = async () => {
        await api.delete('/auth/logout');
        setUser(undefined);
    };

    return (
        <AuthContext.Provider value={{login, logout, user, register}}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
