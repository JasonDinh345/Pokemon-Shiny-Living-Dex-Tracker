import api from '@/lib/axios';
import {Generation} from '@/types/generation';

import axios from 'axios';

export const getGeneration = async (id: number): Promise<Generation> => {
    try {
        const {data} = await api.get<Generation>(`/pokemon/gen/${id}`);
        return data;
    } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            console.error(error);
            throw new Error(`Unknown Generation: ${id}`);
        }

        throw error;
    }
};
