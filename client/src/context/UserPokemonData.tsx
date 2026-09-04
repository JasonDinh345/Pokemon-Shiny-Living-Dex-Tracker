'use client';
import api from '@/lib/axios';
import CaughtShiny from '@/types/caught_shinies';
import {errorToast} from '@/util/toast';

import axios from 'axios';

import {createContext, useContext, useState, ReactNode, useEffect} from 'react';
import {useAuth} from './AuthContext';

type UserPokemonDataContextType = {
    caughtShinies: CaughtShiny[];
    isReady: boolean;
    addShiny: (formData: AddPokemonForm, pokemon_name: string) => void;
    editShiny: (formData: AddPokemonForm, id: number) => void;
    deleteShiny: (id: number) => void;
};
const UserPokemonDataContext = createContext<UserPokemonDataContextType | undefined>(undefined);

export const UserPokemonDataProvider = ({children}: {children: ReactNode}) => {
    const [isReady, setIsReady] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [caughtShinies, setCaughtShinies] = useState<CaughtShiny[]>([]);
    const {user} = useAuth();
    useEffect(() => {
        setIsReady(false);
        const getData = async () => {
            try {
                const res = await api.get('/caught-shinies/all');
                const shinies = res.data.map((shiny: CaughtShiny) => ({
                    ...shiny,
                    date_caught: shiny.date_caught ? new Date(shiny.date_caught) : null,
                    hunt_started: shiny.hunt_started ? new Date(shiny.hunt_started) : null
                }));
                setCaughtShinies(shinies);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const message = error.response?.data.error || 'Something went wrong!';
                    setError(message);
                    errorToast(message);
                }
            }
            setIsReady(true);
        };

        if (user) {
            getData();
        }
    }, [user]);
    const addShiny = async (formData: AddPokemonForm, pokemon_name: string) => {
        const updatedForm: Omit<CaughtShiny, 'id' | 'user_email'> = {
            ...formData,
            hunt_started: formData.hunt_started ? new Date(formData.hunt_started) : null,
            date_caught: formData.date_caught ? new Date(formData.date_caught) : null,
            encounters:
                formData.encounters && Number(formData.encounters) !== 0
                    ? Number(formData?.encounters)
                    : null,
            pokemon_name
        };
        const res = await api.post(`/caught-shinies/`, updatedForm);
        const pokemon = res.data;
        setCaughtShinies((prev) => [
            ...prev,
            {
                ...pokemon,
                date_caught: pokemon.date_caught ? new Date(pokemon.date_caught) : null,
                hunt_started: pokemon.hunt_started ? new Date(pokemon.hunt_started) : null
            }
        ]);
    };
    const editShiny = async (formData: AddPokemonForm, id: number) => {
        const updatedForm: Omit<CaughtShiny, 'id' | 'user_email'> = {
            ...formData,
            hunt_started: formData.hunt_started ? new Date(formData.hunt_started) : null,
            date_caught: formData.date_caught ? new Date(formData.date_caught) : null,
            encounters:
                formData.encounters && Number(formData.encounters) !== 0
                    ? Number(formData?.encounters)
                    : null
        };
        const res = await api.patch(`/caught-shinies/${id}`, updatedForm);
        const updatedShiny = res.data;
        const updatedShinies = caughtShinies.map((shiny) =>
            shiny.id == id
                ? {
                      ...updatedShiny,
                      date_caught: updatedShiny.date_caught
                          ? new Date(updatedShiny.date_caught)
                          : null,
                      hunt_started: updatedShiny.hunt_started
                          ? new Date(updatedShiny.hunt_started)
                          : null
                  }
                : shiny
        );
        setCaughtShinies(updatedShinies);
    };
    const deleteShiny = async (id: number) => {
        await api.delete(`/caught-shinies/${id}`);

        const updatedShinies = caughtShinies.filter((shiny) => shiny.id !== id);
        setCaughtShinies(updatedShinies);
    };
    return (
        <UserPokemonDataContext.Provider
            value={{caughtShinies, isReady, addShiny, editShiny, deleteShiny}}
        >
            {children}
        </UserPokemonDataContext.Provider>
    );
};
export const useUserPokemonData = () => {
    const context = useContext(UserPokemonDataContext);
    if (!context) throw new Error('useUserPokemonData must be used within UserPokemonDataProvider');
    return context;
};
