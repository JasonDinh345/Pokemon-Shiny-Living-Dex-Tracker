'use client';
import {FilterBar} from '@/components/pokedex/FilterBar';
import {PokeDexProgessBar} from '@/components/pokedex/PokeDexProgressBar';
import PokemonCollection from '@/components/pokedex/PokemonCollection';
import PokemonSideBar from '@/components/pokedex/PokemonSideBar';
import {SearchBar} from '@/components/pokedex/SearchBar';
import {useAllPokemon} from '@/context/AllPokemonContext';
import {useAuth} from '@/context/AuthContext';

import {FilterValues} from '@/types/filterValues';

import {Pokemon} from '@/types/pokemon';
import {findGen} from '@/util/findGen';
import {useRouter} from 'next/navigation';

import {useEffect, useMemo, useState} from 'react';

export function PokeDexClient() {
    const router = useRouter();
    const {allPokemon, allGen, isReady} = useAllPokemon();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filterValues, setFilterValues] = useState<FilterValues>({
        orderBy: '',
        gen: '',
        method: '',
        game: '',
        minEncounters: '',
        maxEncounters: '',
        minHuntStart: '',
        maxDateCaught: ''
    });
    const {user, authReady} = useAuth();
    useEffect(() => {
        if (!user && authReady) {
            router.replace('/login');
        }
    }, [user, isReady]);
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
        <div className="relative flex min-h-0 flex-1 flex-row w-full overflow-hidden bg-tertiary">
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <div className="flex flex-col justify-center items-center m-2">
                    <SearchBar value={searchQuery} setSearchQuery={setSearchQuery} />
                    <FilterBar filterValues={filterValues} setFilterValues={setFilterValues} />
                    <PokeDexProgessBar
                        matchingPokemonLength={matchingPokemon.length}
                        filterValues={filterValues}
                    />
                </div>
                <PokemonCollection filterValues={filterValues} allPokemon={matchingPokemon} />
            </div>
            <PokemonSideBar />
        </div>
    );
}
