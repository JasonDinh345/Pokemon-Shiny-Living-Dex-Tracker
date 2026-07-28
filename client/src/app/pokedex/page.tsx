import PokemonCollection from '@/components/pokedex/PokemonCollection';
import {AllPokemonProvider} from '@/context/AllPokemonContext';

export default function PokeDex() {
    return (
        <div>
            <PokemonCollection />
        </div>
    );
}
