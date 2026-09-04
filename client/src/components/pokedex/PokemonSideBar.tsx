'use client';

import {useAddPokemonModal} from '@/context/AddPokemonModalContext';
import {useUserPokemonData} from '@/context/UserPokemonData';
import {Pokemon} from '@/types/pokemon';
import {capitilize} from '@/util/captilize';
import {formatDate} from '@/util/formatDate';
import {getPokemonImageSrc} from '@/util/getPokemonImageSrc';
import Image from 'next/image';
import {useEffect, useMemo, useState} from 'react';
import {ShinyInfo} from '../ui/ShinyInfo';
import {useSearchParams} from 'next/navigation';

import {useAllPokemon} from '@/context/AllPokemonContext';

import {DupeShinySelector} from './DupeShinySelector';
export default function PokemonSideBar() {
    const [pokemonIndex, setPokemonIndex] = useState<number>(-1);
    const {allPokemon} = useAllPokemon();
    const searchParams = useSearchParams();

    const pokemonName = searchParams.get('pokemon');
    const shinyIndex: number = Number(searchParams.get('number')) || 0;
    useEffect(() => {
        const index = allPokemon.findIndex((pokemon) => pokemon.name === pokemonName);
        setPokemonIndex(index);
    }, [pokemonName, allPokemon]);
    const pokemon: Pokemon = allPokemon[pokemonIndex];
    const previousPokemon = allPokemon[pokemonIndex - 1];
    const nextPokemon = allPokemon[pokemonIndex + 1];
    const {caughtShinies} = useUserPokemonData();
    const {setChosenPokemon, setIsVisible, setToEditing} = useAddPokemonModal();

    const shinies = useMemo(() => {
        return pokemon ? caughtShinies.filter((shiny) => shiny.pokemon_name === pokemon.name) : [];
    }, [caughtShinies, pokemon]);

    const handleMarkAsHunted = () => {
        setChosenPokemon(pokemon || null);
        setIsVisible(true);
    };
    const handleEdit = () => {
        setToEditing(shinies[shinyIndex]);
        setChosenPokemon(pokemon || null);
    };
    return (
        <>
            <div className="flex w-1/5 shrink-0 flex-col items-center overflow-hidden border-2 border-l-primary border-secondary bg-secondary gap-2">
                {pokemon ? (
                    <>
                        <Image
                            src={getPokemonImageSrc(pokemon.id)}
                            alt={`Shiny ${pokemon.name}`}
                            width={200}
                            height={200}
                            className="bg-tertiary p-2 rounded-2xl shadow-normal ring-2 ring-primary mt-2"
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
                                {shinies[shinyIndex]?.nickname ? shinies[shinyIndex].nickname : ''}
                            </h2>
                        </div>
                        {shinies.length > 0 && shinies[shinyIndex] ? (
                            <>
                                {shinies.length > 1 && (
                                    <>
                                        <DupeShinySelector shinies={shinies} />
                                    </>
                                )}
                                <div className="bg-tertiary rounded-4xl p-4 shadow-normal border-2 border-primary w-4/5 mt-2 flex flex-col gap-2 relative">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="size-6 absolute right-0 -translate-x-6 hover:text-primary transition-colors duration-75 ease-in"
                                        onClick={handleEdit}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                        />
                                    </svg>
                                    <h2 className="text-2xl text-center underline font-bold">
                                        Hunt Info
                                    </h2>
                                    <ShinyInfo label="Game" value={shinies[shinyIndex].game} />

                                    <ShinyInfo label="Method" value={shinies[shinyIndex].method} />
                                    {shinies[shinyIndex].encounters && (
                                        <ShinyInfo
                                            label="Encounters"
                                            value={shinies[shinyIndex].encounters}
                                        />
                                    )}

                                    {shinies[shinyIndex].hunt_started && (
                                        <ShinyInfo
                                            label="Hunt Started"
                                            value={formatDate(shinies[shinyIndex].hunt_started)}
                                        />
                                    )}
                                    {shinies[shinyIndex].date_caught && (
                                        <ShinyInfo
                                            label="Date Caught"
                                            value={formatDate(shinies[shinyIndex].date_caught)}
                                        />
                                    )}
                                </div>
                            </>
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
                        {pokemonIndex !== -1 && (
                            <div className="flex-1 flex items-end justify-between w-full p-2">
                                <div
                                    className={`flex flex-row items-center justify-center  ${!previousPokemon ? 'text-stone-400 cursor-default' : 'cursor-pointer'}`}
                                    onClick={
                                        previousPokemon
                                            ? () =>
                                                  window.history.replaceState(
                                                      null,
                                                      '',
                                                      `/pokedex?pokemon=${previousPokemon.name}`
                                                  )
                                            : undefined
                                    }
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="size-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15.75 19.5 8.25 12l7.5-7.5"
                                        />
                                    </svg>
                                    <p>PREV</p>
                                    <div className="size-12.5">
                                        {previousPokemon ? (
                                            <Image
                                                src={getPokemonImageSrc(previousPokemon.id)}
                                                alt={`Shiny ${previousPokemon.name}`}
                                                width={50}
                                                height={50}
                                            />
                                        ) : null}
                                    </div>
                                </div>
                                <div
                                    className={`flex flex-row items-center justify-center  ${!nextPokemon ? 'text-stone-400 cursor-default' : 'cursor-pointer'}`}
                                    onClick={
                                        nextPokemon
                                            ? () =>
                                                  window.history.replaceState(
                                                      null,
                                                      '',
                                                      `/pokedex?pokemon=${nextPokemon.name}`
                                                  )
                                            : undefined
                                    }
                                >
                                    <div className="size-12.5">
                                        {nextPokemon ? (
                                            <Image
                                                src={getPokemonImageSrc(nextPokemon.id)}
                                                alt={`Shiny ${nextPokemon.name}`}
                                                width={50}
                                                height={50}
                                            />
                                        ) : null}
                                    </div>
                                    <p>NEXT</p>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="size-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m8.25 4.5 7.5 7.5-7.5 7.5"
                                        />
                                    </svg>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <p>No Shiny Selected!</p>
                )}
            </div>
        </>
    );
}
