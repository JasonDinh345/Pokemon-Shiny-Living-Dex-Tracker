'use client';

import api from '@/lib/axios';
import CaughtShiny from '@/types/caught_shinies';
import {Pokemon} from '@/types/pokemon';

import {createContext, ReactNode, useContext, useState} from 'react';

type AddPokemonModelContextType = {
    isVisible: boolean;
    setIsVisible: (isVisible: boolean) => void;
    addShiny: (pokemonData: Partial<CaughtShiny>) => Promise<CaughtShiny>;
    chosenPokemon: Pokemon | null;

    setChosenPokemon: (pokemon: Pokemon | null) => void;
};
const AddPokemonModelContext = createContext<AddPokemonModelContextType | undefined>(undefined);

export const AddPokemonModelProvider = ({children}: {children: ReactNode}) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [chosenPokemon, setChosenPokemon] = useState<Pokemon | null>(null);
    const addShiny = async (pokemonData: Partial<CaughtShiny>): Promise<CaughtShiny> => {
        const res = await api.post(`/caught-shinies/`, pokemonData);
        return res.data as CaughtShiny;
    };

    return (
        <AddPokemonModelContext.Provider
            value={{
                addShiny,

                isVisible,
                setIsVisible,
                chosenPokemon,

                setChosenPokemon
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
