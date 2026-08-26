import type {Metadata} from 'next';
import {Sora} from 'next/font/google';
import './globals.css';
import NavBar from '@/components/layout/NavBar';
import {AllPokemonProvider} from '@/context/AllPokemonContext';
import Footer from '@/components/layout/Footer';
import {AuthProvider} from '@/context/AuthContext';
import PageTransition from '@/components/misc/PageTransition';
import {Toaster} from 'react-hot-toast';
import {AddPokemonForm} from '@/components/modal/AddPokemonForm';
import {AddPokemonModelProvider} from '@/context/AddPokemonModalContext';
import {UserPokemonDataProvider} from '@/context/UserPokemonData';

const sora = Sora({subsets: ['latin'], weight: ['400', '700']});

export const metadata: Metadata = {
    title: {
        default: 'PrismaDex',
        template: '%s | PrismaDex'
    },
    description: 'A Shiny Living Dex Tracker'
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${sora.className} h-full antialiased `}>
            <body className="flex h-screen flex-col overflow-hidden bg-tertiary">
                <AuthProvider>
                    <UserPokemonDataProvider>
                        <AddPokemonModelProvider>
                            <NavBar />

                            <AllPokemonProvider>
                                <main className="flex min-h-0 flex-1 overflow-hidden bg-tertiary">
                                    <PageTransition>{children}</PageTransition>
                                    <Toaster />
                                </main>

                                <AddPokemonForm />
                            </AllPokemonProvider>
                        </AddPokemonModelProvider>
                    </UserPokemonDataProvider>
                    <Footer />
                </AuthProvider>
            </body>
        </html>
    );
}
