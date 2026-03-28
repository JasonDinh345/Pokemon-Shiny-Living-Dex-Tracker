import "dotenv/config";
import { Request, Response } from "express"
import prisma from "../lib/prisma";
import bcrypt from 'bcrypt'
import User from "../types/users.type"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { Prisma } from "@prisma/client";
import RefreshToken from "../types/refresh_tokens.type";

export const login = async (req: Request, res: Response): Promise<void> => {
    try{
        const {email, password} = req.body as {email: string, password: string};
        if(!email || !password){
            res.status(400).json({error: "Invalid fields!"})
            return;
        }
        const user : User | null= await prisma.users.findUnique({
            where: {email}
        })
        if(!user){
            res.status(404).json({error: "User with email not found!"})
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            res.status(401).json({error: "Incorrect passoword!"})
            return;
        }
        const accessToken: string = generateAccessToken(user.email);
        const refreshToken: string = jwt.sign({email : user.email, jti: crypto.randomUUID()}, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });
        //deletes all old refresh tokens if they didnt logout
        await prisma.refresh_tokens.deleteMany({
            where:{
                expires_on: {lt: new Date()}
            }
        })
        await prisma.refresh_tokens.create({
            data: {
                token: refreshToken,
                user_email : user.email,
                expires_on: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            } 
        })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, 
                secure: process.env.PROJECT_STATUS === 'production', 
                sameSite: 'strict', 
                maxAge: 7 * 24 * 60 * 60 * 1000, 
            });
        res.cookie('accessToken', accessToken, {
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
        const existingToken: RefreshToken | null = await prisma.refresh_tokens.findUnique({
            where:{
                token: refreshToken
            }
        })
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
            const accessToken = generateAccessToken(user.email)
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
const generateAccessToken = (email: string): string => {
        return jwt.sign({email}, process.env.ACCESS_TOKEN_SECRET!, {expiresIn: '15min'})
}