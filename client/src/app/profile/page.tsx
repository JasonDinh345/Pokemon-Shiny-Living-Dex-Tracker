'use client';
import {useAuth} from '@/context/AuthContext';
import {useUserPokemonData} from '@/context/UserPokemonData';
import CaughtShiny from '@/types/caught_shinies';
import {capitilize} from '@/util/captilize';
import dayDiff from '@/util/dayDiff';
import {useRouter} from 'next/navigation';
import {useEffect, useMemo} from 'react';

export default function Profile() {
    const {logout, user, authReady} = useAuth();
    const {caughtShinies} = useUserPokemonData();
    const router = useRouter();
    useEffect(() => {
        if (!user && authReady) {
            router.push('/login');
        }
    });
    const averageEncounters = useMemo(() => {
        const filteredShines = caughtShinies.filter((shiny) => shiny.encounters);
        const total = filteredShines.reduce((sum, shiny) => sum + (shiny.encounters || 0), 0);
        const average = total / filteredShines.length;
        return filteredShines.length == 0 ? 0 : average;
    }, [caughtShinies]);
    const methodMostUsed = useMemo(() => {
        const counts = caughtShinies.reduce<Record<string, number>>((counts, shiny) => {
            const method = shiny.method;

            counts[method] = (counts[method] || 0) + 1;

            return counts;
        }, {});
        const mostMethod = Object.entries(counts).reduce(
            (max, current) => (current[1] > max[1] ? current : max),
            ['', 0]
        )[0];

        return mostMethod;
    }, [caughtShinies]);
    const gameMostUsed = useMemo(() => {
        const counts = caughtShinies.reduce<Record<string, number>>((counts, shiny) => {
            const game = shiny.game;

            counts[game] = (counts[game] || 0) + 1;

            return counts;
        }, {});
        const mostGame = Object.entries(counts).reduce(
            (max, current) => (current[1] > max[1] ? current : max),
            ['', 0]
        )[0];

        return mostGame;
    }, [caughtShinies]);
    const longestHunt = useMemo(() => {
        const filteredShines = caughtShinies.filter(
            (shiny) => shiny.hunt_started && shiny.date_caught
        );
        if (filteredShines.length === 0) {
            return null;
        }

        const shiny = filteredShines.reduce((max, current) =>
            dayDiff(current.hunt_started!, current.date_caught!) >
            dayDiff(max.hunt_started!, max.date_caught!)
                ? current
                : max
        );
        return shiny;
    }, [caughtShinies]);
    return (
        <div className="flex flex-col justify-center items-center m-2 gap-4">
            <div className="p-2 flex flex-col items-center justify-center border-2 border-primary bg-secondary shadow-normal rounded-2xl">
                <h1 className="font-bold text-2xl underline pb-2">Profile</h1>
                <div className="flex flex-col">
                    <div className="flex gap-2">
                        <p>Username: </p>
                        <p className="font-semibold">{user?.username}</p>
                    </div>
                    <div className="flex gap-2">
                        <p>Email: </p>
                        <p className="font-semibold">{user?.email}</p>
                    </div>
                </div>
            </div>
            {caughtShinies && (
                <div className="p-2 flex flex-col items-center justify-center border-2 border-primary bg-secondary shadow-normal rounded-2xl">
                    <h1 className="font-bold text-2xl underline pb-2">Stats</h1>
                    <div className="flex flex-col">
                        <div className="flex gap-2">
                            <p>Total Shinies: </p>
                            <p className="font-semibold">{caughtShinies.length}</p>
                        </div>
                        <div className="flex gap-2">
                            <p>Average Encounters: </p>
                            <p className="font-semibold">{averageEncounters}</p>
                        </div>
                        <div className="flex gap-2">
                            <p>Most Used Method: </p>
                            <p className="font-semibold">{methodMostUsed}</p>
                        </div>
                        <div className="flex gap-2">
                            <p>Game Most Shinies Caught: </p>
                            <p className="font-semibold">{gameMostUsed}</p>
                        </div>
                        <div className="flex gap-2">
                            <p>Longest Hunt: </p>
                            <p className="font-semibold">
                                {longestHunt
                                    ? `${capitilize(longestHunt.pokemon_name)} ${longestHunt.nickname ? `(${longestHunt.nickname})` : ''}`
                                    : 'No Shinies Found!'}
                                , {dayDiff(longestHunt?.hunt_started!, longestHunt?.date_caught!)}{' '}
                                day(s)
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <button
                onClick={logout}
                className="bg-red-400 w-1/10 p-2 rounded-3xl border-2 hover:text-black text-secondary border-black shadow-normal transition-all duration-100 ease-in hover:bg-red-500 hover:shadow-[2px_2px_3px_gray]"
            >
                Logout
            </button>
        </div>
    );
}
