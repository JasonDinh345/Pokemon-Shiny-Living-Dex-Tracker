import CaughtShiny from '@/types/caught_shinies';
import {Generation} from '@/types/generation';
import {Pokemon} from '@/types/pokemon';

export const findGen = (pokemon: Pokemon | CaughtShiny, allGen: Generation[]) => {
    const pokemonName = 'name' in pokemon ? pokemon.name : pokemon.pokemon_name;

    const gen = allGen.find((gen) =>
        gen.pokemon_species.some((species) => species.name === pokemonName)
    );

    return gen?.id;
};
