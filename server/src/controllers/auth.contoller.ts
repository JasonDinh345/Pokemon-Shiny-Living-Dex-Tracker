import { ENV } from '../config/env';
import { NextFunction, Request, Response } from "express"

import { OAuth2Client } from "google-auth-library";

import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken"

import { Prisma } from "@prisma/client";
import RefreshToken from "../types/tokens.type";
import * as authService from "../services/auth.service"
import * as userService from "../services/user.service"
import { TOKEN_TYPES } from '../config/token_types';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const authenticateToken =  (req:Request, res: Response, next: NextFunction) =>{
        const accessToken = req.cookies.accessToken;
        
        if(!accessToken){
            res.status(403).json("Token cannot be null or undefined")
            return;
        }
        jwt.verify(accessToken, ENV.ACCESS_TOKEN_SECRET, ((err :VerifyErrors | null, decoded: JwtPayload | string | undefined)=>{
            if(err){
                res.status(401).json({message:"Token can't be verified"})
                return;
            }
            
            req.user = decoded as {email: string}
            next()
        }))
}
export const googleLogin = async (req: Request, res: Response): Promise<void> => {
    const {token} = req.body;
    if (!token) {
        res.status(400).json({ error: "Missing Google token" });
        return;
    }
    try{
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            res.status(401).json({ error: "Invalid Google account" });
            return;
        }
        const email = payload.email;
        const name = payload.name;
        const googleID = payload.sub;

        const user = await userService.findUserByEmail(email)

        if(!user){
            await authService.addGoogleUser(name!, email, googleID)
        }
         await authService.deleteOldTokens();
        const tokens : {accessToken : string, refreshToken: string} | undefined = await authService.createTokens(email);
        if(!tokens){
            throw new Error();
        }
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true, 
                secure: ENV.PROJECT_STATUS === 'production', 
                sameSite: 'strict', 
                maxAge: 7 * 24 * 60 * 60 * 1000, 
            });
        res.cookie('accessToken', tokens.accessToken, {
            httpOnly: true,
            secure: ENV.PROJECT_STATUS === 'production', 
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });
        res.status(200).json({ email, username: name })
    }catch(error){
         
        res.status(500).json({ error: 'Something went wrong' });
    }
}
export const login = async (req: Request, res: Response): Promise<void> => {
    try{
        const {email, password} = req.body as {email: string, password: string};
        const user : {email: string, username: string} | undefined = await authService.login(email, password)
        if(!user){
            throw new Error("INVALID")
        }
        
        //deletes all old refresh tokens if they didnt logout
        await authService.deleteOldTokens();
        const tokens : {accessToken : string, refreshToken: string} | undefined = await authService.createTokens(user.email);
        if(!tokens){
            throw new Error();
        }
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true, 
                secure: ENV.PROJECT_STATUS === 'production', 
                sameSite: 'strict', 
                maxAge: 7 * 24 * 60 * 60 * 1000, 
            });
        res.cookie('accessToken', tokens.accessToken, {
            httpOnly: true,
            secure: ENV.PROJECT_STATUS === 'production', 
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });
        res.status(200).json({ email: user.email, username: user.username })
    }catch(error){
        if(error instanceof Error){
            switch(error.message){
                case "INVALID_FIELDS":
                    res.status(400).json({error: "Invalid fields!"})
                    break;
                case "INVALID":
                    res.status(401).json({error: "Email is invalid or the password is incorrect!"})
                    break;
            }
        }
        res.status(500).json({ error: 'Something went wrong' });
    }
}   

export const registerUser = async (req: Request, res: Response) => {
    try{
        const {username, email, password} = req.body;
        const addedUser: boolean | undefined = await authService.registerUser(username, email, password);
        if(!addedUser){
            res.json(409).json({error: "Email already in use!"});
            return;
        }
        res.status(201).json({message: "User Created"})
    }catch(err){
        res.status(500).json({error: "Something went wrong!"})
    }

}
// Reset Pass Routes
export const sendResetToken = async (req: Request, res: Response) =>{
    try{
        const {email} = req.user!
        await authService.sendResetToken(email)
        res.status(202).json({message: "Email sent to the inbox if its in use!"})
    }catch(error){
        if(error instanceof Error){
            switch(error.message){
                case "NOT_AUTH":
                    res.status(401).json({error:"Not authorized!"})
                    return;
            }
        }
        res.status(500).json({error: "Something went wrong!"})
    }
}
export const verifyResetToken = async (req: Request, res: Response) =>{
    const token = req.query.token as string
    if(!token){
        res.status(400).json({error: "Link has expired"})
        return;
    }
    try{
        const resetToken = await authService.verifyResetToken(token)
        if(resetToken){
            res.status(200).json({message: "Link verified!"})
        }else{
            res.status(400).json({error: "Link has expired"})
        }
       
    }catch(error){
        res.status(500).json({ error: 'Something went wrong' });
    }
}
export const resetPass = async (req: Request, res: Response) =>{
    const {token, password} = req.body
    try{
        const passReset = await authService.resetPass(token, password);
        if(passReset){
            res.status(200).json({message:"Password reset!"})
        }else{
            res.status(400).json({error: "Link has expired"})
        }
    }catch(error){
        throw new Error();
    }
}
// Email Verification 
export const verifyEmail = async (req: Request, res: Response) =>{
    const token = req.query.token as string
    if(!token){
        res.status(400).json({error: "Link has expired"})
        return;
    }
    try{
        await authService.verifyEmail(token)
        res.status(200).json({message: "Email verified!"})
    }catch(error){
        res.status(500).json({ error: 'Something went wrong' });
    }
}
export const logout = async (req: Request, res: Response): Promise<void> =>{
    const refreshToken: string = req.cookies.refreshToken
    if (!refreshToken) {
        res.status(400).json({ error: 'No refresh token provided' });
        return;
    }   
    try{
        await authService.deleteToken(refreshToken, TOKEN_TYPES.REFRESH)
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        res.status(200).json({ message: 'Logged out' });
    }catch(error){
         if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                
                res.clearCookie('refreshToken');
                res.clearCookie('accessToken');
                res.status(200).json({ message: 'Logged out' });
                return;
            }
        }
        res.status(500).json({ error: 'Something went wrong' });
    }
}
export const getNewToken = async (req: Request, res: Response): Promise<void> =>{
    const refreshToken: string = req.cookies.refreshToken
    if (!refreshToken) {
        res.status(400).json({ error: 'No refresh token provided' });
        return;
    } 
    try{
        const existingToken: RefreshToken | undefined = await authService.getRefreshToken(refreshToken);
        if(!existingToken){
            res.status(404).json({error: "Token not found!"})
            res.clearCookie('refreshToken');
            return;
        }
        jwt.verify(refreshToken, ENV.REFRESH_TOKEN_SECRET, (err, decoded)=>{
            if(err){
                res.status(401).json({message:"Refresh token is not valid"})
                return;
            }
            const user = decoded as {email: string};
            const accessToken = authService.generateAccessToken(user.email)
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: ENV.PROJECT_STATUS === 'production', 
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000
            });
        })

    }catch(error){
        res.status(500).json({ error: 'Something went wrong' });
    }
    
}
