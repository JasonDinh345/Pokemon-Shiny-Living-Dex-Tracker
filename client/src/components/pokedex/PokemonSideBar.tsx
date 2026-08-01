'use client';

import {useUserPokemonData} from '@/context/UserPokemonData';
import {Pokemon} from '@/types/pokemon';
import {capitilize} from '@/util/captilize';
import {getPokemonImageSrc} from '@/util/getPokemonImageSrc';
import Image from 'next/image';
import {useMemo, useState} from 'react';
type PokemonSideBarType = {
    pokemon?: Pokemon;
};
export default function PokemonSideBar({pokemon}: PokemonSideBarType) {
    const {caughtShinies} = useUserPokemonData();
    const [currentIndex, setCurrentIndex] = useState(0);
    const shinies = useMemo(() => {
        return pokemon ? caughtShinies.filter((shiny) => shiny.pokemon_name === pokemon.name) : [];
    }, [caughtShinies, pokemon]);

    return (
        <div className="flex w-1/5 shrink-0 flex-col items-center overflow-hidden border-2 border-l-primary border-secondary bg-secondary">
            {pokemon ? (
                <>
                    <Image
                        src={getPokemonImageSrc(pokemon.id)}
                        alt={`Shiny ${pokemon.name}`}
                        width={200}
                        height={200}
                    />
                    <h1 className="text-2xl font-bold p-2">{capitilize(pokemon.name)}</h1>
                    {shinies.length > 0 ? (
                        <div>
                            <h3>{shinies[currentIndex].nickname}</h3>
                        </div>
                    ) : (
                        <p>Shiny {capitilize(pokemon.name)} not hunted yet!</p>
                    )}
                </>
            ) : (
                <p>No Shiny Selected!</p>
            )}
        </div>
    );
}
