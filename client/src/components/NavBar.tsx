'use client';
import {useAuth} from '@/context/AuthContext';
import Link from 'next/link';

export default function NavBar() {
    const {user} = useAuth();
    return (
        <nav
            style={{padding: '1rem', background: '#eee'}}
            className="flex flex-row font-bold gap-2"
        >
            <Link href="/">Home </Link> |<Link href="/pokedex">PokeDex</Link> |
            {user ? <Link href="/profile">{user.username}</Link> : <Link href="/login">Login</Link>}
        </nav>
    );
}
