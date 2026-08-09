'use client';

import {useAddPokemonModal} from '@/context/AddPokemonModalContext';
import {useUserPokemonData} from '@/context/UserPokemonData';
import {Pokemon} from '@/types/pokemon';
import {capitilize} from '@/util/captilize';
import {formatDate} from '@/util/formatDate';
import {getPokemonImageSrc} from '@/util/getPokemonImageSrc';
import Image from 'next/image';
import {useMemo, useState} from 'react';
type PokemonSideBarType = {
    pokemon?: Pokemon;
};
export default function PokemonSideBar({pokemon}: PokemonSideBarType) {
    const {caughtShinies} = useUserPokemonData();
    const {setChosenPokemon, setIsVisible} = useAddPokemonModal();
    const [currentIndex, setCurrentIndex] = useState(0);
    const shinies = useMemo(() => {
        return pokemon ? caughtShinies.filter((shiny) => shiny.pokemon_name === pokemon.name) : [];
    }, [caughtShinies, pokemon]);
    const handleMarkAsHunted = () => {
        setChosenPokemon(pokemon || null);
        setIsVisible(true);
    };
    return (
        <div className="flex w-1/5 shrink-0 flex-col items-center overflow-hidden border-2 border-l-primary border-secondary bg-secondary">
            {pokemon ? (
                <>
                    <Image
                        src={getPokemonImageSrc(pokemon.id)}
                        alt={`Shiny ${pokemon.name}`}
                        width={200}
                        height={200}
                    />
                    <div className=" flex flex-col gap-2 justify-center items-center">
                        {' '}
                        <div className=" flex flex-row gap-2">
                            <h1 className="text-2xl font-bold">
                                {' '}
                                <span className="text-gray-500 font-normal">
                                    #{pokemon.id}{' '}
                                </span>{' '}
                                {capitilize(pokemon.name)}
                            </h1>
                        </div>
                        <h2 className="text-xl font-normal">
                            {shinies[currentIndex]?.nickname ? shinies[currentIndex].nickname : ''}
                        </h2>
                    </div>
                    {shinies.length > 0 ? (
                        <div className="bg-tertiary rounded-4xl p-4 shadow-normal border-2 border-primary w-4/5 mt-2 flex flex-col gap-2">
                            <h2 className="text-2xl text-center underline font-bold">Hunt Info</h2>
                            <ShinyInfo label="Game" value={shinies[currentIndex].game} />

                            <ShinyInfo label="Method" value={shinies[currentIndex].method} />
                            {shinies[currentIndex].encounters && (
                                <ShinyInfo
                                    label="Encounters"
                                    value={shinies[currentIndex].encounters}
                                />
                            )}

                            {shinies[currentIndex].hunt_started && (
                                <ShinyInfo
                                    label="Hunt Started"
                                    value={formatDate(shinies[currentIndex].hunt_started)}
                                />
                            )}
                            {shinies[currentIndex].date_caught && (
                                <ShinyInfo
                                    label="Date Caught"
                                    value={formatDate(shinies[currentIndex].date_caught)}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <p>Shiny {capitilize(pokemon.name)} not hunted yet!</p>
                            <button
                                className="bg-primary p-2 rounded-3xl border-2 hover:text-black text-secondary border-black shadow-normal transition-all duration-100 ease-in hover:bg-darkprimary hover:shadow-[2px_2px_3px_gray]"
                                onClick={handleMarkAsHunted}
                            >
                                Mark as Hunted?
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <p>No Shiny Selected!</p>
            )}
        </div>
    );
}
type ShinyInfoProp = {
    label: string;
    value: string | number;
};
function ShinyInfo({label, value}: ShinyInfoProp) {
    return (
        <div>
            <p className="text-primary text-lg font-bold">{label}:</p>
            <p className="text-black">{value}</p>
        </div>
    );
}
