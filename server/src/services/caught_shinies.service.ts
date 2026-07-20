import {Prisma} from '@prisma/client';
import prisma from '../lib/prisma';
import CaughtShiny, {ShinyWithCount} from '../types/caught_shinies_type';
/**
 * Inserts new shiny into users collection
 * @param pokemon pokemon data
 * @param email user email
 * @returns the pokemon record
 */
export const addNewShiny = async (
    pokemon: Omit<CaughtShiny, 'id'>,
    email: string
): Promise<CaughtShiny> => {
    try {
        if (!pokemon.pokemon_name || !pokemon.game || !pokemon.method) {
            throw new Error('INVALID_FIELDS');
        }
        const addedPokemon: CaughtShiny = await prisma.caught_shinies.create({
            data: {...pokemon, user_email: email}
        });
        return addedPokemon;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error();
    }
};
/**
 * Gets all shinies of a user
 * @param email user email
 * @returns the collection of shinies of a user
 */
export const getAllShiniesOfUser = async (email: string): Promise<ShinyWithCount[]> => {
    try {
        if (!email) {
            throw new Error('INVALID_AUTH');
        }
        const shinies: CaughtShiny[] = await prisma.caught_shinies.findMany({
            where: {user_email: email}
        });
        const shiniesWCount = shinies.reduce<Record<string, ShinyWithCount>>((acc, shiny) => {
            const key = shiny.pokemon_name;
            if (!acc[key]) {
                acc[key] = {...shiny, count: 0};
            }
            acc[key].count++;
            return acc;
        }, {});
        return Object.values(shiniesWCount);
    } catch (error) {
        console.log(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            switch (error.code) {
                case 'P2003':
                    throw new Error('USER_NOT_FOUND');
            }
        } else if (error instanceof Error) {
            throw new Error(error.message);
        }

        throw new Error();
    }
};
/**
 * Gets record of shiny of a user
 * @param email user email
 * @param id pokemon id
 * @returns pokemon record
 */
export const getShinyOfUser = async (email: string, id: number): Promise<CaughtShiny | null> => {
    try {
        if (!email) {
            throw new Error('INVALID_AUTH');
        }
        const shiny: CaughtShiny | null = await prisma.caught_shinies.findUnique({
            where: {user_email: email, id}
        });
        return shiny;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            switch (error.code) {
                case 'P2003':
                    throw new Error('USER_NOT_FOUND');
            }
        } else if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error();
    }
};
/**
 * Updates a shiny in ones collection
 * @param email user email
 * @param pokemon pokemon data
 * @param id pokemon id
 * @returns
 */
export const updateShiny = async (
    email: string,
    pokemon: Partial<CaughtShiny>,
    pokemonID: number
): Promise<CaughtShiny> => {
    const {user_email, id, ...pokemonData} = pokemon;
    try {
        const updatedPokemon: CaughtShiny = await prisma.caught_shinies.update({
            where: {id: pokemonID, user_email: email},
            data: pokemonData
        });

        return updatedPokemon;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            switch (error.code) {
                case 'P2025':
                    throw new Error('POKEMON_NOT_FOUND');
            }
        } else if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error();
    }
};
/**
 * Deletes a shiny from a users collection
 * @param email user email
 * @param id pokemon id
 */
export const deleteShiny = async (email: string, id: number): Promise<boolean> => {
    try {
        const res = await prisma.caught_shinies.deleteMany({
            where: {user_email: email, id}
        });
        return res.count > 0;
    } catch (error) {
        throw new Error();
    }
};
