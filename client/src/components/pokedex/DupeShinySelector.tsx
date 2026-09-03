'use client';

import CaughtShiny from '@/types/caught_shinies';
import {useSearchParams} from 'next/navigation';
import {motion} from 'framer-motion';

type DupeShinySelectorProps = {
    shinies: CaughtShiny[];
};

export function DupeShinySelector({shinies}: DupeShinySelectorProps) {
    const searchParams = useSearchParams();

    const pokemonName = searchParams.get('pokemon');
    const shinyIndex = Number(searchParams.get('number')) || 0;

    const changeShiny = (offset: number) => {
        const newIndex = (shinyIndex + offset + shinies.length) % shinies.length;

        window.history.replaceState(null, '', `/pokedex?pokemon=${pokemonName}&number=${newIndex}`);
    };

    const visibleDots = 5;

    const dotSpacing = 20;

    const centerPosition = Math.floor(visibleDots / 2);

    const maxOffset = Math.max(0, shinies.length - visibleDots);

    const offset = Math.min(Math.max(0, shinyIndex - centerPosition), maxOffset);

    return (
        <div className="w-full flex flex-row items-center justify-center gap-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 cursor-pointer"
                onClick={() => changeShiny(-1)}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                />
            </svg>

            <div
                className="overflow-hidden"
                style={{
                    width: `${visibleDots * dotSpacing}px`
                }}
            >
                <motion.div
                    className="flex items-center gap-2"
                    animate={{
                        x: -(offset * dotSpacing)
                    }}
                    transition={{
                        duration: 0.3,
                        ease: 'easeInOut'
                    }}
                >
                    {shinies.map((shiny, key) => (
                        <div
                            key={key}
                            className={`size-3 shrink-0 rounded-full transition-colors duration-100 ease-in ${
                                shinyIndex === key ? 'bg-primary' : 'bg-stone-400'
                            }`}
                        />
                    ))}
                </motion.div>
            </div>

            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 cursor-pointer"
                onClick={() => changeShiny(1)}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
        </div>
    );
}
