'use client';

import {useUserPokemonData} from '@/context/UserPokemonData';
import {Pokemon} from '@/types/pokemon';
import CaughtShiny from '@/types/caught_shinies';
import {useMemo, useRef} from 'react';
import {useVirtualizer} from '@tanstack/react-virtual';
import {PokemonIcon} from './PokemonIcon';

type PokemonCollectionType = {
    setSelectedPokemon: (pokemon: Pokemon) => void;
    allPokemon: Pokemon[];
};

export default function PokemonCollection({setSelectedPokemon, allPokemon}: PokemonCollectionType) {
    const {caughtShinies} = useUserPokemonData();

    const parentRef = useRef<HTMLDivElement>(null);

    const COLUMN_COUNT = 13;
    const CARD_SIZE = 110;

    const shiniesByPokemon = useMemo(() => {
        const map = new Map<string, CaughtShiny[]>();

        for (const shiny of caughtShinies) {
            const list = map.get(shiny.pokemon_name) ?? [];
            list.push(shiny);
            map.set(shiny.pokemon_name, list);
        }

        return map;
    }, [caughtShinies]);

    const rowCount = Math.ceil(allPokemon.length / COLUMN_COUNT);

    const rowVirtualizer = useVirtualizer({
        count: rowCount,
        getScrollElement: () => parentRef.current,
        estimateSize: () => CARD_SIZE,
        overscan: 3
    });

    return (
        <div ref={parentRef} className="flex-1 min-h-0 overflow-y-auto">
            <div
                style={{
                    height: rowVirtualizer.getTotalSize(),
                    position: 'relative'
                }}
            >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const startIndex = virtualRow.index * COLUMN_COUNT;

                    return (
                        <div
                            key={virtualRow.key}
                            style={{
                                position: 'absolute',
                                top: virtualRow.start,
                                width: '100%'
                            }}
                            className="flex gap-1"
                        >
                            {allPokemon
                                .slice(startIndex, startIndex + COLUMN_COUNT)
                                .map((pokemon) => (
                                    <PokemonIcon
                                        key={pokemon.id}
                                        pokemon={pokemon}
                                        setSelectedPokemon={setSelectedPokemon}
                                        caughtList={shiniesByPokemon.get(pokemon.name) ?? []}
                                    />
                                ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
