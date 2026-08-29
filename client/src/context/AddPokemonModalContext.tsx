'use client';

import CaughtShiny from '@/types/caught_shinies';
import {Pokemon} from '@/types/pokemon';

import {createContext, ReactNode, useContext, useState} from 'react';

type AddPokemonModelContextType = {
    isVisible: boolean;
    setIsVisible: (isVisible: boolean) => void;

    chosenPokemon: Pokemon | null;
    setToEditing: (shiny: CaughtShiny) => void;
    editingShinyID: number | undefined;
    formData: AddPokemonForm;
    setChosenPokemon: (pokemon: Pokemon | null) => void;
    reset: () => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};
const AddPokemonModelContext = createContext<AddPokemonModelContextType | undefined>(undefined);

export const AddPokemonModelProvider = ({children}: {children: ReactNode}) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [chosenPokemon, setChosenPokemon] = useState<Pokemon | null>(null);
    const [editingShinyID, setIsEditingShinyID] = useState<number | undefined>();
    const [formData, setFormData] = useState<AddPokemonForm>({
        pokemon_name: '',
        method: '',
        nickname: '',
        hunt_started: null,
        date_caught: null,
        encounters: null,
        game: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        if (name === 'encounters') {
            setFormData((prev) => ({...prev, [name]: Number(value)}));
            return;
        }
        setFormData((prev) => ({...prev, [name]: value}));
    };
    const setToEditing = (shiny: CaughtShiny) => {
        setIsEditingShinyID(shiny.id);
        setFormData({
            pokemon_name: shiny.pokemon_name,
            method: shiny.method,
            nickname: shiny.nickname ? shiny.nickname : '',
            hunt_started: shiny.hunt_started
                ? shiny.hunt_started.toISOString().split('T')[0]
                : null,
            date_caught: shiny.date_caught ? shiny.date_caught.toISOString().split('T')[0] : null,
            encounters: shiny.encounters ? shiny.encounters : null,
            game: shiny.game
        });
        setIsVisible(true);
    };
    const reset = () => {
        setFormData({
            pokemon_name: '',
            method: '',
            nickname: '',
            hunt_started: null,
            date_caught: null,
            encounters: null,
            game: ''
        });
        setIsEditingShinyID(undefined);
        setChosenPokemon(null);
    };
    return (
        <AddPokemonModelContext.Provider
            value={{
                setToEditing,
                isVisible,
                setIsVisible,
                chosenPokemon,
                formData,
                editingShinyID,
                handleChange,
                setChosenPokemon,
                reset
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
