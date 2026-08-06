'use client';
import api from '@/lib/axios';
import CaughtShiny from '@/types/caught_shinies';
import {errorToast} from '@/util/toast';

import axios from 'axios';

import {createContext, useContext, useState, ReactNode, useEffect} from 'react';

type UserPokemonDataContextType = {
    caughtShinies: CaughtShiny[];
    isReady: boolean;
};
const UserPokemonDataContext = createContext<UserPokemonDataContextType | undefined>(undefined);

export const UserPokemonDataProvider = ({children}: {children: ReactNode}) => {
    const [isReady, setIsReady] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [caughtShinies, setCaughtShinies] = useState<CaughtShiny[]>([]);
    useEffect(() => {
        setIsReady(false);
        const getData = async () => {
            try {
                const res = await api.get('/caught-shinies/all');
                setCaughtShinies(res.data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const message = error.response?.data.error || 'Something went wrong!';
                    setError(message);
                    errorToast(message);
                }
            }
            setIsReady(true);
        };

        getData();
    }, []);

    return (
        <UserPokemonDataContext.Provider value={{caughtShinies, isReady}}>
            {children}
        </UserPokemonDataContext.Provider>
    );
};
export const useUserPokemonData = () => {
    const context = useContext(UserPokemonDataContext);
    if (!context) throw new Error('useUserPokemonData must be used within UserPokemonDataProvider');
    return context;
};
