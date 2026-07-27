import PokemonCollection from '@/components/collection/PokemonCollection';
import {AllPokemonProvider} from '@/context/AllPokemonContext';
import {getPokemon} from '@/util/getPokemon';
import Image from 'next/image';

export default function Collection() {
    return (
        <AllPokemonProvider>
            <div>
                <PokemonCollection />
            </div>
        </AllPokemonProvider>
    );
}
