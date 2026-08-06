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
import {Pokemon} from '@/types/pokemon';
import CaughtShiny from '@/types/caught_shinies';
import axios from 'axios';
import {errorToast} from '@/util/toast';
type AddPokemonFormType = {
    pokemon_name: string;
    method: string;
    nickname: string | null;
    hunt_started: string | null;
    date_caught: string | null;
    encounters: number | null;
    game: string;
};
export function AddPokemonForm() {
    const {isVisible, setChosenPokemon, setIsVisible, chosenPokemon, addShiny} =
        useAddPokemonModal();
    const [error, setError] = useState<string>('');
    const {isReady, allGen} = useAllPokemon();
    const [formData, setFormData] = useState<AddPokemonFormType>({
        pokemon_name: '',
        method: '',
        nickname: '',
        hunt_started: null,
        date_caught: null,
        encounters: null,
        game: ''
    });
    const handleExit = () => {
        setChosenPokemon(null);
        setIsVisible(false);
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        if (name === 'encounters') {
            setFormData((prev) => ({...prev, [name]: Number(value)}));
            return;
        }
        setFormData((prev) => ({...prev, [name]: value}));
    };
    const findGen = (pokemon: Pokemon) => {
        const gen = allGen.find((gen) =>
            gen.pokemon_species.find((pokemon1) => pokemon1.name === pokemon.name)
        );
        return gen?.id;
    };
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!chosenPokemon) {
            return;
        }
        const updatedForm: Omit<CaughtShiny, 'id' | 'user_email'> = {
            ...formData,
            hunt_started: formData.hunt_started ? new Date(formData.hunt_started) : null,
            date_caught: formData.date_caught ? new Date(formData.date_caught) : null,
            encounters:
                formData.encounters && Number(formData.encounters) !== 0
                    ? Number(formData?.encounters)
                    : null,
            pokemon_name: chosenPokemon.name
        };
        try {
            await addShiny(updatedForm);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data.message || 'Something went wrong!';
                setError(message);
                errorToast(message);
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
                                onClick={() => setChosenPokemon(null)}
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
                                    Add a Shiny {capitilize(chosenPokemon.name)} to your Dex:
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
                                                    game.generation >= (findGen(chosenPokemon) || 0)
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
                                <input
                                    className="bg-primary w-1/3 p-2 rounded-3xl border-2 hover:text-black text-secondary border-black shadow-normal transition-all duration-100 ease-in hover:bg-darkprimary hover:shadow-[2px_2px_3px_gray]"
                                    type="submit"
                                    value="Add to Dex"
                                />
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
