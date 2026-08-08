'use client';

import {useUserPokemonData} from '@/context/UserPokemonData';
import {Pokemon} from '@/types/pokemon';
import CaughtShiny from '@/types/caught_shinies';
import {useMemo, useRef} from 'react';
import {useVirtualizer} from '@tanstack/react-virtual';
import {PokemonIcon} from './PokemonIcon';
import {FilterValueType} from '@/app/pokedex/page';

type PokemonCollectionType = {
    setSelectedPokemon: (pokemon: Pokemon) => void;
    allPokemon: Pokemon[];
    filterValues: FilterValueType;
};

export default function PokemonCollection({
    setSelectedPokemon,
    allPokemon,
    filterValues
}: PokemonCollectionType) {
    const {caughtShinies} = useUserPokemonData();
    const parentRef = useRef<HTMLDivElement>(null);

    const COLUMN_COUNT = 13;
    const CARD_SIZE = 110;
    const matchingCaughtShinies = useMemo(() => {
        return caughtShinies
            .filter((shiny) => {
                // Search
                if (filterValues.game && shiny.game !== filterValues.game) {
                    return false;
                }

                // Minimum encounters
                if (
                    filterValues.minEncounters !== '' &&
                    shiny.encounters &&
                    shiny.encounters < Number(filterValues.minEncounters)
                ) {
                    return false;
                }

                // Maximum encounters
                if (
                    filterValues.maxEncounters !== '' &&
                    shiny.encounters &&
                    shiny.encounters > Number(filterValues.maxEncounters)
                ) {
                    return false;
                }

                return true;
            })
            .sort((a, b) => {
                switch (filterValues.orderBy) {
                    case '3':
                        return (a.encounters || 0) - (b.encounters || 0);

                    case '4':
                        return (b.encounters || 0) - (a.encounters || 0);
                    case '5':
                        return (
                            (a.hunt_started || new Date(0)).getTime() -
                            (b.hunt_started || new Date(0)).getTime()
                        );

                    case '6':
                        return (
                            (b.hunt_started || new Date(0)).getTime() -
                            (a.hunt_started || new Date(0)).getTime()
                        );
                    default:
                        return a.id - b.id;
                }
            });
    }, [caughtShinies, filterValues]);
    const shiniesByPokemon = useMemo(() => {
        const map = new Map<string, CaughtShiny[]>();

        for (const shiny of matchingCaughtShinies) {
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
                            {filterValues.orderBy && Number(filterValues.orderBy) > 2
                                ? matchingCaughtShinies
                                      .slice(startIndex, startIndex + COLUMN_COUNT)
                                      .map((pokemon) => (
                                          <PokemonIcon
                                              key={pokemon.id}
                                              pokemon={allPokemon.find(
                                                  (pokemon1) =>
                                                      pokemon1.name == pokemon.pokemon_name
                                              )}
                                              setSelectedPokemon={setSelectedPokemon}
                                              caughtList={
                                                  shiniesByPokemon.get(pokemon.pokemon_name) ?? []
                                              }
                                          />
                                      ))
                                : allPokemon
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
