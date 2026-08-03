'use client';
import {useAllPokemon} from '@/context/AllPokemonContext';
import {capitilize} from '@/util/captilize';
import {getPokemonImageSrc} from '@/util/getPokemonImageSrc';
import {useState} from 'react';
import Image from 'next/image';
import {useAddPokemonModal} from '@/context/AddPokemonModalContext';
export function AddPokemonSearch() {
    const [query, setQuery] = useState<string>('');
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const {allPokemon} = useAllPokemon();
    const {setChosenPokemon} = useAddPokemonModal();

    const matchingPokemon = allPokemon.filter(
        (pokemon) =>
            pokemon.name.toLowerCase().startsWith(query.toLowerCase()) ||
            pokemon.id.toString().startsWith(query)
    );
    const filteredPokemon = matchingPokemon.slice(0, 10);
    return (
        <>
            <input
                type="search"
                id="pokeSearch"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Search by name or ID..."
                autoComplete="off"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {filteredPokemon.length > 0 && query !== '' && isFocused && (
                <div className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto rounded-md bg-secondary shadow-lg border hide-scrollbar inset-shadow-sm inset-shadow-stone-500">
                    {filteredPokemon.map((pokemon) => (
                        <div
                            className="flex flex-row justify-between items-center p-2 hover:bg-tertiary hover:border-2 cursor-pointer hover:border-primary box-border border-b-2 border-tertiary"
                            onMouseDown={() => setChosenPokemon(pokemon)}
                            key={pokemon.id}
                        >
                            <div className="flex flex-row gap-2">
                                <p className="text-gray-500 italic">#{pokemon.id}</p>
                                <p>{capitilize(pokemon.name)}</p>
                            </div>
                            <Image
                                alt={pokemon.name}
                                width={50}
                                height={50}
                                src={getPokemonImageSrc(pokemon.id)}
                            />
                        </div>
                    ))}
                    {matchingPokemon.length > 10 && (
                        <p className="text-sm text-primary p-2 text-center italic">
                            Showing top 10 results. Refine your search to see more!
                        </p>
                    )}
                </div>
            )}
        </>
    );
}
