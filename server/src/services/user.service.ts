import prisma from '../lib/prisma';
import User from '../types/users.type';
import {Prisma} from '@prisma/client';
/**
 * gets a user based on email
 * @param email user email
 * @returns user record
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
    try {
        const existingUser: User | null = await prisma.users.findUnique({
            where: {email}
        });
        return existingUser;
    } catch (err) {
        throw new Error();
    }
};
/**
 * updates a user
 * @param user user data
 * @param email user email
 * @returns true if successful, false if else
 */
export const changeUsername = async (username: string, email: string): Promise<void> => {
    try {
        await prisma.users.update({
            where: {email},
            data: {username}
        });
    } catch (error) {
        throw new Error('Failed to update user');
    }
};
/**
 * Deletes a user
 * @param email user email
 * @returns true if successful, false if else
 */
export const deleteUser = async (email: string): Promise<boolean> => {
    try {
        await prisma.users.delete({
            where: {email}
        });
        return true;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            switch (error.code) {
                case 'P2025':
                    throw new Error('NOT_AUTH');
            }
        }
        throw new Error('Failed to update user');
    }
};
