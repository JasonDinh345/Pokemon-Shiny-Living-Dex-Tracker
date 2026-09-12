'use client';
import {MockPokemonSideBar} from '@/components/misc/MockPokemonSideBar';
import {useScreenSize} from '@/context/ScreenSizeContext';
import {ScreenSize} from '@/enum/ScreenSize';
import CaughtShiny from '@/types/caught_shinies';
import {useRouter} from 'next/navigation';

export default function Home() {
    const router = useRouter();
    const {screenSize} = useScreenSize();
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
        <div className="flex flex-col flex-1 bg-linear-to-r from-primary to-emerald-700 justify-center items-center gap-2 md:flex-row relative z-0">
            <div className="flex justify-center items-center md:w-1/2 w-full p-2 md:p-0">
                <div className="lg:w-2/3 flex gap-2 flex-col md:justify-start md:items-start md:w-5/6 w-full justify-center items-center">
                    <h1 className="font-extrabold text-5xl text-secondary text-shadow-lg text-center md:text-left">
                        Track your progress on your Shiny Living Dex!
                    </h1>
                    <p className="font-bold text-center md:text-left">
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
                    classname="md:z-3 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-1 opacity-5 md:static md:inset-0 md:translate-0 md:opacity-100"
                />
                {screenSize == ScreenSize.LG && (
                    <>
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
                    </>
                )}
            </div>
        </div>
    );
}
