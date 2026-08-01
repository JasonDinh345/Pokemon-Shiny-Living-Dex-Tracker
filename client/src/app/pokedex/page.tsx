'use client';
import PokemonCollection from '@/components/pokedex/PokemonCollection';
import PokemonSideBar from '@/components/pokedex/PokemonSideBar';
import {SearchBar} from '@/components/pokedex/SearchBar';
import {useAllPokemon} from '@/context/AllPokemonContext';
import {UserPokemonDataProvider} from '@/context/UserPokemonData';

import {Pokemon} from '@/types/pokemon';
import {useState} from 'react';

export default function PokeDex() {
    const {allPokemon} = useAllPokemon();
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon>();
    const [searchQuery, setSearchQuery] = useState<string>('');

    return (
        <UserPokemonDataProvider>
            <div className="relative flex min-h-0 flex-1 flex-row w-full overflow-hidden bg-tertiary">
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    <SearchBar value={searchQuery} setSearchQuery={setSearchQuery} />
                    <PokemonCollection
                        setSelectedPokemon={setSelectedPokemon}
                        allPokemon={allPokemon}
                    />
                </div>
                <PokemonSideBar pokemon={selectedPokemon} />
            </div>
        </UserPokemonDataProvider>
    );
}
