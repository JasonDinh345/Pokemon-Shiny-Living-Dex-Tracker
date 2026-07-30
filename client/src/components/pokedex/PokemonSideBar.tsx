'use client';

import {Pokemon} from '@/types/pokemon';
import Image from 'next/image';
type PokemonSideBarType = {
    pokemon?: Pokemon;
};
export default function PokemonSideBar({pokemon}: PokemonSideBarType) {
    return (
        <div className="flex w-1/5 shrink-0 flex-col items-center overflow-hidden border-2 border-l-primary border-secondary">
            {pokemon ? (
                <>
                    <Image
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${pokemon.id}.png`}
                        alt={`Shiny ${pokemon.name}`}
                        width={200}
                        height={200}
                    />{' '}
                </>
            ) : (
                <p>No Shiny Selected!</p>
            )}
        </div>
    );
}
