'use client';
import {Generation} from '@/types/generation';
import {Pokemon} from '@/types/pokemon';
import {getGeneration} from '@/util/getGeneration';
import {getPokemon} from '@/util/getPokemon';
import {errorToast} from '@/util/toast';

import {createContext, useContext, useState, ReactNode, useEffect} from 'react';

type AllPokemonContextType = {
    allPokemon: Pokemon[];
    allGen: Generation[];
    error: string | null;
    isReady: boolean;
    setIsReady: (isReady: boolean) => void;
};
const AllPokemonContext = createContext<AllPokemonContextType | undefined>(undefined);

export const AllPokemonProvider = ({children}: {children: ReactNode}) => {
    const [allGen, setAllGen] = useState<Generation[]>([]);
    const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
    const [isReady, setIsReady] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    //do a is ready
    useEffect(() => {
        setIsReady(false);
        const fetchGens = async () => {
            let isEnd = false;
            let genNum = 1;
            while (!isEnd) {
                try {
                    const genData = await getGeneration(genNum++);

                    const pokemonData = await Promise.all(
                        genData.pokemon_species.map((pokemon) => {
                            const pokemonId = Number(pokemon.url.split('/').at(-2));
                            return getPokemon(pokemonId);
                        })
                    );
                    setAllPokemon((prev) => [...prev, ...pokemonData]);

                    setAllGen((prev) => [...prev, genData]);
                } catch (error) {
                    if (error instanceof Error && error.message.startsWith('Unknown Generation:')) {
                        isEnd = true;
                    } else {
                        errorToast('Something went wrong!');
                    }
                }
            }
            setAllPokemon((prev) => prev.sort((pokemon1, pokemon2) => pokemon1.id - pokemon2.id));
            setIsReady(true);
        };

        fetchGens();
    }, []);

    return (
        <AllPokemonContext.Provider value={{allPokemon, allGen, error, isReady, setIsReady}}>
            {children}
        </AllPokemonContext.Provider>
    );
};
export const useAllPokemon = () => {
    const context = useContext(AllPokemonContext);
    if (!context) throw new Error('useAllPokemon must be used within AllPokemonProvider');
    return context;
};
