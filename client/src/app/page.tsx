'use client';
import {MockPokemonSideBar} from '@/components/misc/MockPokemonSideBar';
import CaughtShiny from '@/types/caught_shinies';
import {useRouter} from 'next/navigation';

export default function Home() {
    const router = useRouter();
    const mockShines: Omit<CaughtShiny, 'user_email' | 'id'>[] = [
        {
            pokemon_name: 'Zygarde',
            game: 'Shield',
            method: 'Dynamax Adventures',
            nickname: 'Zen',
            date_caught: new Date(2022, 6, 2),
            hunt_started: new Date(2022, 6, 1),
            encounters: 22
        },
        {
            pokemon_name: 'Charizard',
            game: 'Ultra Moon',
            method: 'Masuda Method',
            nickname: 'Blaze',
            date_caught: new Date(2022, 8, 14),
            hunt_started: new Date(2022, 8, 1),
            encounters: 412
        },
        {
            pokemon_name: 'Eevee',
            game: 'Scarlet',
            method: 'Masuda Method',
            nickname: 'Mochi',
            date_caught: new Date(2023, 4, 27),
            hunt_started: new Date(2023, 4, 12),
            encounters: 286
        },
        {
            pokemon_name: 'Rayquaza',
            game: 'Shield',
            method: 'Dynamax Adventures',
            nickname: 'Skye',
            date_caught: new Date(2022, 7, 15),
            hunt_started: new Date(2022, 7, 10),
            encounters: 47
        }
    ];
    return (
        <div className="flex flex-row flex-1 bg-linear-to-r from-primary to-emerald-700 justify-center items-center gap-2">
            <div className="flex justify-center items-center w-1/2">
                <div className="w-2/3 flex gap-2 flex-col justify-start items-start">
                    <h1 className="font-extrabold text-5xl text-secondary text-shadow-lg">
                        Track your progress on your Shiny Living Dex!
                    </h1>
                    <p className="font-bold">
                        Includes all 1025 Pokemon and games up until Pokemon Legends: Z-A
                    </p>
                    <button
                        className="w-1/3 h-16 rounded-4xl shadow-normal border-2 border-darkprimary bg-tertiary font-bold text-darkprimary hover:bg-stone-300 transition-colors ease-in duration-0.75 cursor-pointer"
                        onClick={() => router.push('/pokedex')}
                    >
                        Start Now!
                    </button>
                </div>
            </div>
            <div className="w-1/2 flex ">
                <MockPokemonSideBar
                    mockPokemon={mockShines[0]}
                    pokemonID={718}
                    isCaught={true}
                    classname="z-3"
                />
                <MockPokemonSideBar
                    mockPokemon={mockShines[1]}
                    pokemonID={6}
                    isCaught={true}
                    classname="z-2 -translate-x-3/4 rotate-10"
                />
                <MockPokemonSideBar
                    mockPokemon={mockShines[2]}
                    pokemonID={133}
                    isCaught={true}
                    classname="z-1 -translate-x-3/2 rotate-15"
                />
                <MockPokemonSideBar
                    mockPokemon={mockShines[2]}
                    pokemonID={384}
                    isCaught={true}
                    classname="z-0 -translate-x-9/4 rotate-20"
                />
            </div>
        </div>
    );
}
