'use client';

import api from '@/lib/axios';
import CaughtShiny from '@/types/caught_shinies';
import {Pokemon} from '@/types/pokemon';
import axios from 'axios';
import {createContext, ReactNode, useContext, useState} from 'react';

type AddPokemonModelContextType = {
    error: string | null;
    isVisible: boolean;
    setIsVisible: (isVisible: boolean) => void;
    addShiny: (pokemonData: Partial<CaughtShiny>) => Promise<CaughtShiny>;
    chosenPokemon: Pokemon | null;
    sendPokemonToForm: (pokemon: Pokemon) => void;
    handleExit: () => void;
};
const AddPokemonModelContext = createContext<AddPokemonModelContextType | undefined>(undefined);

export const AddPokemonModelProvider = ({children}: {children: ReactNode}) => {
    const [error, setError] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [chosenPokemon, setChosenPokemon] = useState<Pokemon | null>(null);
    const addShiny = async (pokemonData: Partial<CaughtShiny>): Promise<CaughtShiny> => {
        try {
            const res = await api.post(`/caught-shinies/`, pokemonData);
            return res.data as CaughtShiny;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data.error);
            } else {
                setError(`Something went wrong!`);
            }
            throw error;
        }
    };
    const sendPokemonToForm = (pokemon: Pokemon) => {
        setChosenPokemon(pokemon);
        setIsVisible(true);
    };
    const handleExit = () => {
        setIsVisible(false);
        setChosenPokemon(null);
    };
    return (
        <AddPokemonModelContext.Provider
            value={{
                addShiny,
                error,
                isVisible,
                setIsVisible,
                chosenPokemon,
                sendPokemonToForm,
                handleExit
            }}
        >
            {children}
        </AddPokemonModelContext.Provider>
    );
};
export const useAddPokemonModal = () => {
    const context = useContext(AddPokemonModelContext);
    if (!context) throw new Error('useAddPokemonModal must be used within AddPokemonModelProvider');
    return context;
};
