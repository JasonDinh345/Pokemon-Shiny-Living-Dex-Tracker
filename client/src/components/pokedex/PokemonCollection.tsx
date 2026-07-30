'use client';
import {useAllPokemon} from '@/context/AllPokemonContext';
import {Pokemon} from '@/types/pokemon';
import Image from 'next/image';
import {useMemo} from 'react';
type PokemonCollectionType = {
    setSelectedPokemon: (pokemon: Pokemon) => void;
};
export default function PokemonCollection({setSelectedPokemon}: PokemonCollectionType) {
    const {allPokemon} = useAllPokemon();
    const sortedPokemon = useMemo(() => {
        return [...allPokemon].sort((a, b) => a.id - b.id);
    }, [allPokemon]);
    return (
        <div className="flex min-h-0 flex-1 flex-row flex-wrap content-start overflow-y-auto overscroll-contain">
            {sortedPokemon.map((pokemon) => (
                <Image
                    onClick={() => setSelectedPokemon(pokemon)}
                    key={pokemon.id}
                    width={100}
                    height={100}
                    alt={pokemon.name}
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${pokemon.id}.png`}
                    className="cursor-pointer"
                />
            ))}
        </div>
    );
}
