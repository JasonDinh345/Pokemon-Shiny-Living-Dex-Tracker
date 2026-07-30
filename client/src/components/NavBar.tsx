'use client';
import {useAuth} from '@/context/AuthContext';
import Link from 'next/link';

export default function NavBar() {
    const {user} = useAuth();
    return (
        <nav className="flex flex-row font-bold gap-2 border-b-gray-400 border-b-2 bg-seconday p-4">
            <Link href="/">Home </Link> |<Link href="/pokedex">PokeDex</Link> |
            {user ? <Link href="/profile">{user.username}</Link> : <Link href="/login">Login</Link>}
        </nav>
    );
}
