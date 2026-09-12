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
            className={`flex w-full max-w-70 shrink-0 flex-col items-center gap-1.5 overflow-hidden rounded-4xl border-4 border-darkprimary bg-secondary p-2 shadow-normal
    sm:max-w-xs
    md:max-w-md
    lg:h-auto lg:w-[clamp(25rem,37.5%,32rem)] lg:max-w-none
    ${classname}`}
        >
            <>
                <Image
                    src={getPokemonImageSrc(pokemonID)}
                    alt={`Shiny ${mockPokemon.pokemon_name}`}
                    width={200}
                    height={200}
                    sizes="(max-width: 640px) 112px, (max-width: 1024px) 144px, 192px"
                    className="mt-1 size-28 rounded-2xl bg-tertiary p-2 shadow-normal ring-4 ring-primary sm:mt-2 sm:size-36 lg:size-48"
                />
                <div className="flex flex-col items-center justify-center gap-1 sm:gap-2">
                    <div className="flex flex-row gap-2">
                        <h1 className="text-lg font-bold sm:text-xl lg:text-2xl">
                            <span className="font-normal text-gray-500">#{pokemonID} </span>
                            {capitilize(mockPokemon.pokemon_name)}
                        </h1>
                    </div>
                    <h2 className="text-base font-normal sm:text-lg lg:text-xl">
                        {mockPokemon.nickname ? mockPokemon.nickname : ''}
                    </h2>
                </div>
                {isCaught ? (
                    <div className="mt-1 flex w-11/12 flex-col gap-1 rounded-4xl border-2 border-primary bg-tertiary p-3 shadow-normal sm:mt-2 sm:gap-2 sm:p-4 [&_p]:text-sm sm:[&_p]:text-base">
                        <h2 className="text-center text-lg font-bold underline sm:text-xl lg:text-2xl">
                            Hunt Info
                        </h2>
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
