'use client';
import {useAddPokemonModal} from '@/context/AddPokemonModalContext';
import {useAuth} from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
export default function NavBar() {
    const {user} = useAuth();
    const {setIsVisible} = useAddPokemonModal();
    return (
        <nav className="flex flex-row font-bold gap-2 border-b-gray-400 border-b-2 bg-seconday p-4 items-center text-xl">
            <Link href="/" className="flex flex-row justify-center items-center gap-2">
                <Image alt="shiny zygarde" width={35} height={35} src={'/zygarde.svg'} /> PrismaDex
            </Link>{' '}
            |
            {user && (
                <>
                    <Link href="/pokedex">PokeDex</Link> |
                    <button
                        onClick={() => setIsVisible(true)}
                        className="bg-primary pl-2 pr-2 rounded-2xl text-tertiary hover:text-black hover:shadow-normal duration:500 ease-in transition-all shadow-[2px_2px_3px_gray] "
                    >
                        Add to Pokédex
                    </button>{' '}
                    |
                </>
            )}
            {user ? <Link href="/profile">{user.username}</Link> : <Link href="/login">Login</Link>}
        </nav>
    );
}
