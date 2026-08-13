import {FilterValueType} from '@/app/pokedex/page';
import {useAllPokemon} from '@/context/AllPokemonContext';
import {useUserPokemonData} from '@/context/UserPokemonData';
import CaughtShiny from '@/types/caught_shinies';
import {capitilize} from '@/util/captilize';
import {findGen} from '@/util/findGen';
import {useMemo} from 'react';

type PokeDexProgessBarProps = {
    filterValues: FilterValueType;
    matchingPokemonLength: number;
};
export function PokeDexProgessBar({filterValues, matchingPokemonLength}: PokeDexProgessBarProps) {
    const {caughtShinies} = useUserPokemonData();
    const {allGen, allPokemon} = useAllPokemon();
    const matchingCaughtShinies = useMemo(() => {
        return caughtShinies.filter((shiny) => {
            // Search
            if (filterValues.gen && findGen(shiny, allGen) !== Number(filterValues.gen)) {
                return false;
            }

            return true;
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
    }, [matchingCaughtShinies]);

    return (
        <div className="flex flex-row justify-center items-center h-10 gap-2">
            {filterValues.gen ? (
                <>
                    <div className="w-2xl h-4/5 relative">
                        <progress
                            max={matchingPokemonLength}
                            value={shiniesByPokemon.size}
                            className="appearance-none size-full rounded-3xl overflow-hidden shadow-normal border-2 border-darkprimary bg-secondary 
                        [&::-webkit-progress-bar]:bg-secondary
                        [&::-webkit-progress-value]:bg-primary
                        [&::-moz-progress-bar]:bg-primary"
                            title={`Shiny Living Dex Completion`}
                        />
                        <p className="absolute inset-0 flex items-center justify-center">
                            {shiniesByPokemon.size}/{matchingPokemonLength}
                        </p>
                    </div>
                    <p>%{Math.ceil(shiniesByPokemon.size / matchingPokemonLength)}</p>
                </>
            ) : (
                <>
                    <div className="w-2xl h-4/5 relative">
                        <progress
                            max={allPokemon.length}
                            value={shiniesByPokemon.size}
                            className="appearance-none size-full rounded-3xl overflow-hidden shadow-normal border-2 border-darkprimary bg-secondary 
                        [&::-webkit-progress-bar]:bg-secondary
                        [&::-webkit-progress-value]:bg-primary
                        [&::-moz-progress-bar]:bg-primary"
                            title={`Shiny Living Dex Completion`}
                        />
                        <p className="absolute inset-0 flex items-center justify-center">
                            {shiniesByPokemon.size}/{allPokemon.length}
                        </p>
                    </div>
                    <p>%{Math.ceil(shiniesByPokemon.size / allPokemon.length)}</p>
                </>
            )}
        </div>
    );
}
