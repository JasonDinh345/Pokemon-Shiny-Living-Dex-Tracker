import {ENV} from '../config/env';
import prisma from '../lib/prisma';
import User from '../types/users.type';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import RefreshToken from '../types/tokens.type';
import {findUserByEmail} from './user.service';
import {sendResetPassEmail, sendVerificationEmail} from '../utils/email';
import {TOKEN_TYPES} from '../config/token_types';
import Token from '../types/tokens.type';
import {tokens_type} from '@prisma/client';
/**
 * Inserts a user into the db
 * @param username username of the user
 * @param email email of the user
 * @param password password of the user
 * @returns true if successful, false if else
 */
export const registerUser = async (
    username: string,
    email: string,
    password: string
): Promise<boolean> => {
    try {
        const user = await findUserByEmail(email);
        if (user) {
            return false;
        }
        const hashedPass = await bcrypt.hash(password!, 10);
        const token = crypto.randomBytes(32).toString('hex');
        await prisma.$transaction(async (tx) => {
            await tx.users.create({
                data: {
                    email,
                    username,
                    password: hashedPass,
                    tokens: {
                        create: {
                            token,
                            expires_on: new Date(Date.now() + 24 * 60 * 60 * 1000),
                            type: TOKEN_TYPES.EMAIL_VERIFICATION
                        }
                    }
                }
            });
            await sendVerificationEmail(email, token);
        });
        return true;
    } catch (error) {
        throw new Error();
    }
};
/**
 * Verifies a login by comparing the password and verification state
 * @param email email of the user
 * @param password password of the user
 * @returns the email and username of the user
 */
export const login = async (
    email: string,
    password: string
): Promise<{email: string; username: string} | undefined> => {
    try {
        const user: User | null = await prisma.users.findUnique({
            where: {email}
        });

        if (!user) {
            throw new Error('INVALID');
        } else if (!user.password) {
            throw new Error('GOOGLE_ACC');
        } else if (!user.verified) {
            throw new Error('NOT_VERIFIED');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return;
        }
        return {email, username: user.username};
    } catch (err) {
        if (err instanceof Error) {
            throw new Error(err.message);
        }
    }
};
/**
 * Inserts a user into db when first logining in via Google
 * @param username username of the user
 * @param email email of the google account
 * @param googleID googleID obtain from google auth
 * @returns true if successful, false if else
 */
export const addGoogleUser = async (
    username: string,
    email: string,
    googleID: string
): Promise<boolean> => {
    try {
        const user = await findUserByEmail(email);
        if (user) {
            return false;
        }
        await prisma.users.create({
            data: {
                email,
                username,
                googleID,
                verified: true
            }
        });
        return true;
    } catch (err) {
        throw new Error();
    }
};

/**
 * Verifies if the token from the request is valid
 * @param token email verification token
 * @returns true if valid, false if else
 */
export const verifyEmail = async (token: string): Promise<boolean> => {
    try {
        const emailToken = await prisma.tokens.findUnique({
            where: {
                token,
                type: TOKEN_TYPES.EMAIL_VERIFICATION
            }
        });
        if (!emailToken || new Date() > emailToken.expires_on) {
            await prisma.tokens.deleteMany({
                where: {token}
            });
            return false;
        }
        await prisma.users.update({
            where: {email: emailToken.user_email},
            data: {
                verified: true
            }
        });
        await deleteToken(token, TOKEN_TYPES.EMAIL_VERIFICATION);
        return true;
    } catch (error) {
        throw new Error();
    }
};
/**
 * Sends a reset password email if the yser exists
 * @param email email of user
 */
export const sendResetToken = async (email: string) => {
    try {
        if (!email) {
            throw new Error('NOT_AUTH');
        }
        const user: User | null = await prisma.users.findUnique({
            where: {email}
        });
        if (!user) {
            return;
        }
        const token = crypto.randomBytes(32).toString('hex');
        await prisma.$transaction(async (tx) => {
            await tx.tokens.create({
                data: {
                    user_email: email,
                    type: TOKEN_TYPES.RESET_PASS,
                    expires_on: new Date(Date.now() + 60 * 60 * 1000),
                    token
                }
            });
            await sendResetPassEmail(email, token);
        });
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error();
    }
};
/**
 * Verifies if the requested reset password token is valid
 * @param token reset password token
 * @returns the token if valid, null if else
 */
export const verifyResetToken = async (token: string): Promise<Token | null> => {
    try {
        await deleteOldTokens();
        const resetToken = await prisma.tokens.findUnique({
            where: {
                token,
                type: TOKEN_TYPES.RESET_PASS
            }
        });

        return resetToken;
    } catch (error) {
        throw new Error();
    }
};
/**
 * Resets the password of the user
 * @param token reset password token
 * @param password new password
 * @returns true if successfull, false if else
 */
export const resetPass = async (token: string, password: string): Promise<boolean> => {
    try {
        const verifed = await verifyResetToken(token);
        if (!verifed) {
            return false;
        }
        const {user_email} = verifed;
        const hashedPass = await bcrypt.hash(password!, 10);
        await prisma.users.update({
            where: {email: user_email},
            data: {
                password: hashedPass
            }
        });
        return true;
    } catch {
        throw new Error();
    }
};
/**
 * Deletes expired tokens
 */
export const deleteOldTokens = async (): Promise<void> => {
    await prisma.tokens.deleteMany({
        where: {
            expires_on: {lt: new Date()}
        }
    });
};
/**
 * Generates access and refresh tokens for a user
 * @param email email of the user
 * @returns the tokens
 */
export const createTokens = async (
    email: string
): Promise<{accessToken: string; refreshToken: string} | undefined> => {
    try {
        const accessToken: string = generateAccessToken(email);
        const refreshToken: string = jwt.sign(
            {email, jti: crypto.randomUUID()},
            ENV.REFRESH_TOKEN_SECRET,
            {expiresIn: '7d'}
        );
        await prisma.tokens.create({
            data: {
                token: refreshToken,
                user_email: email,
                expires_on: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                type: TOKEN_TYPES.REFRESH
            }
        });
        return {accessToken, refreshToken};
    } catch (error) {
        throw new Error();
    }
};
/**
 * gets the token record from a token
 * @param token refresh token
 * @returns the token record
 */
export const getRefreshToken = async (token: string): Promise<RefreshToken | undefined> => {
    try {
        const existingToken: RefreshToken | null = await prisma.tokens.findUnique({
            where: {
                token,
                type: TOKEN_TYPES.REFRESH
            }
        });
        return existingToken ? existingToken : undefined;
    } catch (error) {
        throw new Error();
    }
};
/**
 * Deletes a  token from the db
 * @param token token value
 * @param type token type
 * @returns true if successful, false else
 */
export const deleteToken = async (token: string, type: tokens_type): Promise<boolean> => {
    try {
        const res = await prisma.tokens.deleteMany({
            where: {token, type}
        });
        return res.count > 0;
    } catch (err) {
        throw new Error();
    }
};
/**
 * generates access token for a user
 * @param email email of a user
 * @returns the access token
 */
export const generateAccessToken = (email: string): string => {
    return jwt.sign({email}, ENV.ACCESS_TOKEN_SECRET, {expiresIn: '15min'});
};
