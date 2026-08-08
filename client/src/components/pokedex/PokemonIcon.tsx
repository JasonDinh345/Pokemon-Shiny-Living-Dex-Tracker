import CaughtShiny from '@/types/caught_shinies';
import {Pokemon} from '@/types/pokemon';
import {getPokemonImageSrc} from '@/util/getPokemonImageSrc';
import Image from 'next/image';
import React from 'react';
type PokemonIconType = {
    pokemon?: Pokemon;
    setSelectedPokemon: (pokemon: Pokemon) => void;
    caughtList: CaughtShiny[];
};
export const PokemonIcon = React.memo(function PokemonIcon({
    pokemon,
    setSelectedPokemon,
    caughtList
}: PokemonIconType) {
    return (
        pokemon && (
            <div
                className={`bg-secondary m-1 border-2 relative border-primary rounded-4xl shadow-normal overflow-hidden hover:bg-gray-400 duration-100 ease-in ${caughtList.length == 0 && 'opacity-40'}`}
            >
                {caughtList.length > 1 && (
                    <div className="absolute right-2 top-2 bg-primary rounded-4xl text-center flex items-center justify-center size-6">
                        {caughtList.length}
                    </div>
                )}
                <Image
                    onClick={() => setSelectedPokemon(pokemon)}
                    key={pokemon.id}
                    width={100}
                    height={100}
                    alt={pokemon.name}
                    src={getPokemonImageSrc(pokemon.id)}
                />
            </div>
        )
    );
});
