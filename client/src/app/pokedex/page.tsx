'use client';
import PokemonCollection from '@/components/pokedex/PokemonCollection';
import PokemonSideBar from '@/components/pokedex/PokemonSideBar';

import {Pokemon} from '@/types/pokemon';
import {useState} from 'react';

export default function PokeDex() {
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon>();
    return (
        <div className="relative flex min-h-0 flex-1 flex-row w-full overflow-hidden bg-tertiary">
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <PokemonCollection setSelectedPokemon={setSelectedPokemon} />
            </div>
            <PokemonSideBar pokemon={selectedPokemon} />
        </div>
    );
}
