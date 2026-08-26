import CaughtShiny from '@/types/caught_shinies';
import {capitilize} from '@/util/captilize';
import {formatDate} from '@/util/formatDate';
import {getPokemonImageSrc} from '@/util/getPokemonImageSrc';
import Image from 'next/image';
import {ShinyInfo} from '../ui/ShinyInfo';
type MockPokemonSideBarProps = {
    pokemonID: number;
    mockPokemon: Omit<CaughtShiny, 'user_email' | 'id'>;
    isCaught: boolean;
    classname?: string;
};
export function MockPokemonSideBar({
    pokemonID,
    mockPokemon,
    isCaught,
    classname
}: MockPokemonSideBarProps) {
    return (
        <div
            className={`flex w-3/8 shrink-0 flex-col items-center overflow-hidden border-4 border-darkprimary p-2 bg-secondary gap-2 rounded-4xl h-4/5 shadow-normal ${classname}`}
        >
            <>
                <Image
                    src={getPokemonImageSrc(pokemonID)}
                    alt={`Shiny ${mockPokemon.pokemon_name}`}
                    width={200}
                    height={200}
                    className="bg-tertiary p-2 rounded-2xl shadow-normal ring-4 ring-primary mt-2"
                />
                <div className=" flex flex-col gap-2 justify-center items-center">
                    {' '}
                    <div className=" flex flex-row gap-2">
                        <h1 className="text-2xl font-bold">
                            {' '}
                            <span className="text-gray-500 font-normal">#{pokemonID} </span>{' '}
                            {capitilize(mockPokemon.pokemon_name)}
                        </h1>
                    </div>
                    <h2 className="text-xl font-normal">
                        {mockPokemon.nickname ? mockPokemon.nickname : ''}
                    </h2>
                </div>
                {isCaught ? (
                    <div className="bg-tertiary rounded-4xl p-4 shadow-normal border-2 border-primary w-4/5 mt-2 flex flex-col gap-2">
                        <h2 className="text-2xl text-center underline font-bold">Hunt Info</h2>
                        <ShinyInfo label="Game" value={mockPokemon.game} />

                        <ShinyInfo label="Method" value={mockPokemon.method} />
                        {mockPokemon.encounters && (
                            <ShinyInfo label="Encounters" value={mockPokemon.encounters} />
                        )}

                        {mockPokemon.hunt_started && (
                            <ShinyInfo
                                label="Hunt Started"
                                value={formatDate(mockPokemon.hunt_started)}
                            />
                        )}
                        {mockPokemon.date_caught && (
                            <ShinyInfo
                                label="Date Caught"
                                value={formatDate(mockPokemon.date_caught)}
                            />
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <p>Shiny {capitilize(mockPokemon.pokemon_name)} not hunted yet!</p>
                        <button className="bg-primary p-2 rounded-3xl border-2 hover:text-black text-secondary border-black shadow-normal ">
                            Mark as Hunted?
                        </button>
                    </div>
                )}
            </>
        </div>
    );
}
