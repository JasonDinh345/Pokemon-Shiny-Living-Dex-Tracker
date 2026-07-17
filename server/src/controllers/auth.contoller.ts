import 'dotenv/config';
import {ENV} from '../config/env';
import {Request, Response} from 'express';

import jwt from 'jsonwebtoken';

import {Prisma} from '@prisma/client';
import RefreshToken from '../types/tokens.type';
import * as authService from '../services/auth.service';
import * as userService from '../services/user.service';
import {TOKEN_TYPES} from '../config/token_types';
//client for google auth
import client from '../lib/google';

/**
 * Log in the user with Google Auth and inserts them in the db if needed
 * @param req request from user
 * @param res result of the request
 */
export const googleLogin = async (req: Request, res: Response) => {
    const {token} = req.body;
    if (!token) {
        res.status(400).json({error: 'Missing Google token'});
        return;
    }
    let payload;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        payload = ticket.getPayload();
    } catch (error) {
        res.status(401).json({error: 'Invalid Google account'});
        return;
    }
    try {
        if (!payload || !payload.email) {
            res.status(401).json({error: 'Invalid Google account'});
            return;
        }
        const email = payload.email;
        const name = payload.name;
        const googleID = payload.sub;

        const user = await userService.findUserByEmail(email);

        if (!user) {
            await authService.addGoogleUser(name!, email, googleID);
        } else if (user.password) {
            res.status(409).json({error: 'Email in use! Please use the standard login!'});
            return;
        }
        await authService.deleteOldTokens();
        const tokens: {accessToken: string; refreshToken: string} | undefined =
            await authService.createTokens(email);
        if (!tokens) {
            throw new Error();
        }
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.PROJECT_STATUS === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.cookie('accessToken', tokens.accessToken, {
            httpOnly: true,
            secure: process.env.PROJECT_STATUS === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });
        res.status(200).json({email, username: name});
    } catch (error) {
        res.status(500).json({error: 'Something went wrong'});
    }
};
/**
 * Log in the user
 * @param req request from user
 * @param res result of the request
 */
export const login = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body as {
            email: string;
            password: string;
        };
        const user: {email: string; username: string} | undefined = await authService.login(
            email,
            password
        );
        if (!user) {
            res.status(401).json({
                message: 'Email or password is incorrect!'
            });
            return;
        }
        //deletes all old refresh tokens if they didnt logout
        await authService.deleteOldTokens();
        const tokens: {accessToken: string; refreshToken: string} | undefined =
            await authService.createTokens(user.email);
        if (!tokens) {
            throw new Error();
        }

        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.PROJECT_STATUS === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.cookie('accessToken', tokens.accessToken, {
            httpOnly: true,
            secure: process.env.PROJECT_STATUS === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });
        res.status(200).json({email: user.email, username: user.username});
    } catch (error) {
        if (error instanceof Error) {
            switch (error.message) {
                case 'GOOGLE_ACC':
                    res.status(409).json({
                        error: 'Please sign in with Google!'
                    });
                    break;
                case 'NOT_VERIFIED':
                    res.status(403).json({
                        error: 'Please verify your account!'
                    });
                    break;
                case 'INVALID':
                    res.status(401).json({
                        error: 'Email or password is incorrect!'
                    });
                    break;
            }
        }

        res.status(500).json({error: 'Something went wrong'});
    }
};

/**
 * Registers the user
 * @param req request from user
 * @param res result of the request
 */
export const registerUser = async (req: Request, res: Response) => {
    const {username, email, password} = req.body;

    try {
        const addedUser: boolean | undefined = await authService.registerUser(
            username,
            email,
            password
        );
        if (!addedUser) {
            res.status(409).json({error: 'Email already in use!'});
            return;
        }
        res.status(201).json({message: 'User Created'});
    } catch (err) {
        res.status(500).json({error: 'Something went wrong!'});
    }
};
// Reset Pass Routes
/**
 * Sends a email to reset password
 * @param req request from user
 * @param res result of the request
 */
export const sendResetToken = async (req: Request, res: Response) => {
    try {
        const {email} = req.body;
        if (!email) {
            res.status(400).json({error: 'Enter a email!'});
            return;
        }
        await authService.sendResetToken(email);
        res.status(202).json({
            message: 'Email sent to the inbox if its in use!'
        });
    } catch (error) {
        res.status(500).json({error: 'Something went wrong!'});
    }
};
/**
 * Verifies request to reset password
 * @param req request from user
 * @param res result of the request
 */
export const verifyResetToken = async (req: Request, res: Response) => {
    const token = req.query.token as string;
    if (!token) {
        res.status(400).json({error: 'No token sent!'});
        return;
    }
    try {
        const resetToken = await authService.verifyResetToken(token);

        if (resetToken) {
            res.status(200).json({message: 'Link verified!'});
        } else {
            res.status(403).json({error: 'Link has expired'});
        }
    } catch (error) {
        res.status(500).json({error: 'Something went wrong'});
    }
};
/**
 * Resets the password of the user
 * @param req request from user
 * @param res result of the request
 */
export const resetPass = async (req: Request, res: Response) => {
    const {token, password} = req.body;
    if (!token || !password) {
        res.status(400).json({error: 'Missing fields!'});
    }
    try {
        const passReset = await authService.resetPass(token, password);
        if (passReset) {
            res.status(200).json({message: 'Password reset!'});
        } else {
            res.status(403).json({error: 'Link has expired'});
        }
    } catch (error) {
        res.status(500).json({error: 'Something went wrong'});
    }
};
// Email Verification
/**
 * Verfies the request to verify the user
 * @param req request from user
 * @param res result of the request
 */
export const verifyEmail = async (req: Request, res: Response) => {
    const token = req.query.token as string;
    if (!token) {
        return res.status(400).json({error: 'Link has expired'});
    }
    try {
        const verifed = await authService.verifyEmail(token);
        if (verifed) {
            res.status(200).json({message: 'Email verified!'});
        } else {
            res.status(400).json({error: 'Link has expired'});
        }
    } catch (error) {
        res.status(500).json({error: 'Something went wrong'});
    }
};
/**
 * Log out the user
 * @param req request from user
 * @param res result of the request
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
    const refreshToken: string = req.cookies.refreshToken;
    if (!refreshToken) {
        res.status(400).json({error: 'No refresh token provided'});
        return;
    }
    try {
        await authService.deleteToken(refreshToken, TOKEN_TYPES.REFRESH);
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        res.status(200).json({message: 'Logged out'});
    } catch (error) {
        res.status(500).json({error: 'Something went wrong'});
    }
};
/**
 * Gets a new access token from refresh token
 * @param req request from user
 * @param res result of the request
 */
export const getNewToken = async (req: Request, res: Response): Promise<void> => {
    const refreshToken: string = req.cookies.refreshToken;

    if (!refreshToken) {
        res.status(400).json({error: 'No refresh token provided'});
        return;
    }
    try {
        const existingToken: RefreshToken | undefined =
            await authService.getRefreshToken(refreshToken);
        if (!existingToken) {
            res.status(401).json({error: 'Token expried'});
            res.clearCookie('refreshToken');
            return;
        }
        jwt.verify(refreshToken, ENV.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.status(403).json({message: 'Refresh token is not valid'});
                return;
            }
            const user = decoded as {email: string};
            const accessToken = authService.generateAccessToken(user.email);
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: ENV.PROJECT_STATUS === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000
            });
        });
        res.status(200).json({message: 'Successfully generated new token!'});
    } catch (error) {
        res.status(500).json({error: 'Something went wrong'});
    }
};
