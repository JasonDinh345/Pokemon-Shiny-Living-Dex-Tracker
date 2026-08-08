'use client';
import {FilterBar} from '@/components/pokedex/FilterBar';
import PokemonCollection from '@/components/pokedex/PokemonCollection';
import PokemonSideBar from '@/components/pokedex/PokemonSideBar';
import {SearchBar} from '@/components/pokedex/SearchBar';
import {useAllPokemon} from '@/context/AllPokemonContext';
import {UserPokemonDataProvider} from '@/context/UserPokemonData';

import {Pokemon} from '@/types/pokemon';
import {findGen} from '@/util/findGen';
import {useMemo, useState} from 'react';
export type FilterValueType = {
    orderBy: string;
    gen: string;
    method: string;
    game: string;
    minEncounters: number | '';
    maxEncounters: number | '';
    minHuntStart: string;
    maxDateCaught: string;
};
export default function PokeDex() {
    const {allPokemon, allGen} = useAllPokemon();
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon>();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filterValues, setFilterValues] = useState<FilterValueType>({
        orderBy: '',
        gen: '',
        method: '',
        game: '',
        minEncounters: '',
        maxEncounters: '',
        minHuntStart: '',
        maxDateCaught: ''
    });

    const matchingPokemon = useMemo(() => {
        return allPokemon
            .filter((pokemon) => {
                // Search
                if (
                    searchQuery &&
                    !pokemon.name.toLowerCase().startsWith(searchQuery.toLowerCase())
                ) {
                    return false;
                }

                // Generation
                if (filterValues.gen && findGen(pokemon, allGen) !== Number(filterValues.gen)) {
                    return false;
                }

                // Game

                return true;
            })
            .sort((a, b) => {
                switch (filterValues.orderBy) {
                    case '1':
                        return a.id - b.id;

                    case '2':
                        return b.id - a.id;

                    default:
                        return a.id - b.id;
                }
            });
    }, [allPokemon, searchQuery, filterValues]);

    return (
        <UserPokemonDataProvider>
            <div className="relative flex min-h-0 flex-1 flex-row w-full overflow-hidden bg-tertiary">
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    <SearchBar value={searchQuery} setSearchQuery={setSearchQuery} />
                    <FilterBar filterValues={filterValues} setFilterValues={setFilterValues} />
                    <PokemonCollection
                        setSelectedPokemon={setSelectedPokemon}
                        filterValues={filterValues}
                        allPokemon={matchingPokemon}
                    />
                </div>
                <PokemonSideBar pokemon={selectedPokemon} />
            </div>
        </UserPokemonDataProvider>
    );
}
