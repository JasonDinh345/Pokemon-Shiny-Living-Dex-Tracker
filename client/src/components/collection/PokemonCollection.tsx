'use client';
import {useAllPokemon} from '@/context/AllPokemonContext';
import Image from 'next/image';
import {useMemo} from 'react';
export default function PokemonCollection() {
    const {allPokemon} = useAllPokemon();
    const sortedPokemon = useMemo(() => {
        return [...allPokemon].sort((a, b) => a.id - b.id);
    }, [allPokemon]);
    return (
        <>
            {sortedPokemon.map((pokemon) => (
                <Image
                    key={pokemon.id}
                    width={100}
                    height={100}
                    alt={pokemon.name}
                    src={pokemon.sprites.front_shiny}
                />
            ))}
        </>
    );
}
