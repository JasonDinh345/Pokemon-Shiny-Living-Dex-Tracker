import {Generation} from '@/types/generation';
import {Pokemon} from '@/types/pokemon';

export const findGen = (pokemon: Pokemon, allGen: Generation[]) => {
    const gen = allGen.find((gen) =>
        gen.pokemon_species.find((pokemon1) => pokemon1.name === pokemon.name)
    );
    return gen?.id;
};
