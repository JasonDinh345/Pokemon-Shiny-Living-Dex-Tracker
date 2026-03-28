import { Request, Response } from "express"
import prisma from "../lib/prisma";
import bcrypt from 'bcrypt'
import User from "../types/users.type"
import jwt from "jsonwebtoken"


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
        const refreshToken: string = jwt.sign({email : user.email}, process.env.REFRESH_TOKEN_SECRET!);

        const result = await prisma.refresh_tokens.create({
            data: {
                token: refreshToken,
                user_email : user.email
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
const generateAccessToken = (email: string): string => {
        return jwt.sign({email}, process.env.ACCESS_TOKEN_SECRET!, {expiresIn: '15min'})
}