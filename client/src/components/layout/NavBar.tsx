'use client';

import {useAddPokemonModal} from '@/context/AddPokemonModalContext';
import {useAuth} from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import {usePathname} from 'next/navigation';
import {useEffect, useState} from 'react';

export default function NavBar() {
    const {user} = useAuth();
    const {setIsVisible} = useAddPokemonModal();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const handleAddPokemon = () => {
        setIsVisible(true);
        setIsMenuOpen(false);
    };

    const addPokemonButton = (
        <button
            onClick={handleAddPokemon}
            className="rounded-2xl bg-primary px-2 py-1 text-tertiary shadow-[2px_2px_3px_gray] transition-all duration-500 ease-in hover:text-black hover:shadow-normal"
        >
            Add to Pokédex
        </button>
    );

    const authLink = user ? (
        <Link href="/profile">{user.username}</Link>
    ) : (
        <Link href="/login">Login</Link>
    );

    return (
        <nav className="relative shrink-0 border-b-2 border-b-gray-400 bg-secondary font-bold">
            <div className="flex items-center justify-between gap-2 p-4 text-xl">
                <Link href="/" className="flex flex-row items-center justify-center gap-2">
                    <Image alt="shiny zygarde" width={35} height={35} src="/zygarde.svg" />
                    PrismaDex
                </Link>

                <div className="hidden items-center gap-2 md:flex">
                    {user && (
                        <>
                            <span className="text-gray-400">|</span>
                            <Link href="/pokedex">PokeDex</Link>
                            <span className="text-gray-400">|</span>
                            {addPokemonButton}
                            <span className="text-gray-400">|</span>
                        </>
                    )}
                    {authLink}
                </div>

                <button
                    type="button"
                    className="rounded-lg p-2 transition-colors hover:bg-tertiary md:hidden"
                    onClick={() => setIsMenuOpen((open) => !open)}
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-nav-menu"
                    aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                >
                    {isMenuOpen ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                            />
                        </svg>
                    )}
                </button>
            </div>

            {isMenuOpen && (
                <div
                    id="mobile-nav-menu"
                    className="border-t border-gray-300 bg-secondary px-4 py-3 md:hidden"
                >
                    <div className="flex flex-col gap-3 text-lg">
                        {user && (
                            <>
                                <Link href="/pokedex">PokeDex</Link>
                                {addPokemonButton}
                            </>
                        )}
                        {authLink}
                    </div>
                </div>
            )}
        </nav>
    );
}
