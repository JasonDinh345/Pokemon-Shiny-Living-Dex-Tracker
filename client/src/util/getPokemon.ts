import api from '@/lib/axios';
import {Pokemon} from '@/types/pokemon';
import axios from 'axios';

export const getPokemon = async (id: number): Promise<Pokemon> => {
    try {
        const {data} = await api.get<Pokemon>(`/pokemon/${id}`);
        return data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            throw new Error(`Unknown Pokémon: ${id}`);
        } else {
            throw error;
        }
    }
};
