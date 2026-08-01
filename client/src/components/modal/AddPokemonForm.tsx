'use client';
import {useAddPokemonModal} from '@/context/AddPokemonModalContext';
import {Modal} from './Modal';
import {AnimatePresence} from 'motion/react';
import {useState} from 'react';
import CaughtShiny from '@/types/caught_shinies';
import {useAllPokemon} from '@/context/AllPokemonContext';
import {AddPokemonSearch} from '../ui/AddPokemonSearch';
import Image from 'next/image';
import {getPokemonImageSrc} from '@/util/getPokemonImageSrc';
export function AddPokemonForm() {
    const {isVisible, handleExit, chosenPokemon} = useAddPokemonModal();
    const {isReady, allPokemon} = useAllPokemon();
    const {formData, setFormData} = useState<Partial<CaughtShiny>>({
        pokemon_name: '',
        method: '',
        game: ''
    });

    return (
        <AnimatePresence>
            {isVisible && (
                <Modal handleExit={handleExit}>
                    {chosenPokemon ? (
                        <form>
                            <Image
                                alt={chosenPokemon.name}
                                width={50}
                                height={50}
                                src={getPokemonImageSrc(chosenPokemon.id)}
                            />
                        </form>
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
