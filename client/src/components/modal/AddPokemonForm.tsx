'use client';
import {useAddPokemonModal} from '@/context/AddPokemonModalContext';
import {Modal} from './Modal';
import {AnimatePresence} from 'motion/react';
import {useState} from 'react';

import {useAllPokemon} from '@/context/AllPokemonContext';
import {AddPokemonSearch} from '../ui/AddPokemonSearch';
import Image from 'next/image';
import {getPokemonImageSrc} from '@/util/getPokemonImageSrc';
import {LabelInput, LabelSelect} from '../ui/LabelInput';
import {capitilize} from '@/util/captilize';
import {games} from '@/data/games';
import axios from 'axios';
import {errorToast, successToast} from '@/util/toast';
import {findGen} from '@/util/findGen';
import {useUserPokemonData} from '@/context/UserPokemonData';
import {useSearchParams} from 'next/navigation';
export function AddPokemonForm() {
    const {
        isVisible,
        setChosenPokemon,
        setIsVisible,
        chosenPokemon,
        formData,
        handleChange,
        reset,
        editingShinyID
    } = useAddPokemonModal();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string>('');
    const {isReady, allGen} = useAllPokemon();
    const {addShiny, editShiny, deleteShiny} = useUserPokemonData();
    const handleExit = () => {
        reset();
        setIsVisible(false);
    };
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!chosenPokemon) {
            return;
        }
        try {
            if (editingShinyID !== undefined) {
                await editShiny(formData, editingShinyID);
                successToast(
                    `Saved changes to your Shiny ${capitilize(chosenPokemon.name)} ${formData.nickname && `(${formData.nickname})`}!`
                );
            } else {
                await addShiny(formData, chosenPokemon.name);

                successToast(
                    `Successfully added ${capitilize(chosenPokemon.name)} ${formData.nickname && `(${formData.nickname})`} to your Dex!`
                );
            }
            setChosenPokemon(null);
            setIsVisible(false);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data.message || 'Something went wrong!';
                setError(message);
                errorToast(message);
                console.log(error);
            }
        }
    };
    const handleDelete = async () => {
        if (!chosenPokemon) {
            return;
        }
        try {
            if (editingShinyID !== undefined) {
                await deleteShiny(editingShinyID);
                successToast(
                    `Deleted your Shiny ${capitilize(chosenPokemon.name)} ${formData.nickname && `(${formData.nickname})`}!`
                );
            }
            setChosenPokemon(null);
            setIsVisible(false);
            const pokemonName = searchParams.get('pokemon');
            window.history.replaceState(null, '', `/pokedex?pokemon=${pokemonName}`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data.message || 'Something went wrong!';
                setError(message);
                errorToast(message);
                console.log(error);
            }
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <Modal handleExit={handleExit}>
                    {chosenPokemon ? (
                        <>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={3}
                                stroke="currentColor"
                                className="size-6 text-primary hover:text-black duration-100 ease-in absolute top-2 left-2"
                                onClick={reset}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                                />
                            </svg>

                            <form
                                className="relative flex flex-col gap-2 justify-center items-center"
                                onSubmit={handleSubmit}
                            >
                                <h1 className="font-bold text-2xl p-4">
                                    {editingShinyID !== undefined
                                        ? `Edit Your Shiny ${capitilize(chosenPokemon.name)}:`
                                        : `Add a Shiny ${capitilize(chosenPokemon.name)} to your Dex:`}
                                </h1>
                                <div className="flex flex-col justify-center items-center gap-2">
                                    <Image
                                        alt={chosenPokemon.name}
                                        width={200}
                                        height={200}
                                        src={getPokemonImageSrc(chosenPokemon.id)}
                                    />

                                    <LabelInput
                                        type="text"
                                        label="Nickname"
                                        value={formData.nickname || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-col flex-wrap gap-2 w-full">
                                    <LabelSelect
                                        label="Game"
                                        value={formData.game}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled>
                                            Select a game
                                        </option>
                                        {games
                                            .filter(
                                                (game) =>
                                                    game.generation >=
                                                    (findGen(chosenPokemon, allGen) || 0)
                                            )
                                            .map((game) => (
                                                <option key={game.name} value={game.name}>
                                                    {game.name}
                                                </option>
                                            ))}
                                    </LabelSelect>
                                    <LabelSelect
                                        label="Method"
                                        value={formData.method}
                                        onChange={handleChange}
                                        required
                                        disabled={!formData.game}
                                    >
                                        <option value="" disabled>
                                            Select a method
                                        </option>
                                        {(
                                            games.find((game) => game.name === formData.game)
                                                ?.shinyMethods ?? []
                                        ).map((method) => (
                                            <option key={method} value={method}>
                                                {method}
                                            </option>
                                        ))}
                                    </LabelSelect>
                                    <LabelInput
                                        type="number"
                                        label="Encounters"
                                        value={formData.encounters || ''}
                                        onChange={handleChange}
                                    />
                                    <LabelInput
                                        type="date"
                                        label="Hunt Started"
                                        fieldName="hunt_started"
                                        value={formData.hunt_started || ''}
                                        onChange={handleChange}
                                    />

                                    <LabelInput
                                        type="date"
                                        label="Date Caught"
                                        fieldName="date_caught"
                                        min={formData.hunt_started || ''}
                                        value={formData.date_caught || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                {!error && <p className="text-red-400 italic">{error}</p>}
                                <div className="flex flex-row w-full justify-center items-center gap-2">
                                    <input
                                        className="bg-primary w-1/3 p-2 rounded-3xl border-2 hover:text-black text-secondary border-black shadow-normal transition-all duration-100 ease-in hover:bg-darkprimary hover:shadow-[2px_2px_3px_gray]"
                                        type="submit"
                                        value={editingShinyID !== undefined ? 'Save' : 'Add to Dex'}
                                    />
                                    {editingShinyID && (
                                        <button
                                            className="bg-red-400 w-1/3 p-2 rounded-3xl border-2 hover:text-black text-secondary border-black shadow-normal transition-all duration-100 ease-in hover:bg-red-500 hover:shadow-[2px_2px_3px_gray]"
                                            onClick={handleDelete}
                                            type="button"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="relative w-md max-w-sm">
                            {isReady ? (
                                <>
                                    <h1 className="font-bold text-xl p-2">Add to your Dex...</h1>
                                    <AddPokemonSearch />
                                </>
                            ) : (
                                <div className="p-4 text-center text-gray-700 italic">
                                    Loading Pokémon data...
                                </div>
                            )}
                        </div>
                    )}
                </Modal>
            )}
        </AnimatePresence>
    );
}
