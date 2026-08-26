import {PokeDexClient} from '@/components/pokedex/PokeDexClient';
import {Metadata} from 'next';
export const metadata: Metadata = {
    title: 'PokeDex'
};
export default function PokeDex() {
    return <PokeDexClient />;
}
