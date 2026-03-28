import "dotenv/config";
import { Request, Response } from "express"
import prisma from "../lib/prisma";


import jwt from "jsonwebtoken"

import { Prisma } from "@prisma/client";
import RefreshToken from "../types/refresh_tokens.type";
import * as authService from "../services/auth.service"
export const login = async (req: Request, res: Response): Promise<void> => {
    try{
        const {email, password} = req.body as {email: string, password: string};
        const user : {email: string, username: string} | undefined = await authService.login(email, password)
        if(!user){
            res.status(401).json("Incorrect password!");
            return;
        }
        
        //deletes all old refresh tokens if they didnt logout
        await authService.deleteOldTokens();
        const tokens : {accessToken : string, refreshToken: string} | undefined = await authService.createTokens(user.email);
        if(!tokens){
            throw new Error();
        }
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true, 
                secure: process.env.PROJECT_STATUS === 'production', 
                sameSite: 'strict', 
                maxAge: 7 * 24 * 60 * 60 * 1000, 
            });
        res.cookie('accessToken', tokens.accessToken, {
            httpOnly: true,
            secure: process.env.PROJECT_STATUS === 'production', 
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });
        res.status(200).json({ email: user.email, username: user.username })
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
        await prisma.refresh_tokens.delete({
            where:{
                token: refreshToken
            }
        })
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
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (err, decoded)=>{
            if(err){
                res.status(401).json({message:"Refresh token is not valid"})
                return;
            }
            const user = decoded as {email: string};
            const accessToken = authService.generateAccessToken(user.email)
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.PROJECT_STATUS === 'production', 
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000
            });
        })

    }catch(error){
        res.status(500).json({ error: 'Something went wrong' });
    }
    
}
