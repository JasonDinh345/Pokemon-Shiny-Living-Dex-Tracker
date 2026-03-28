import "dotenv/config";
import prisma from "../lib/prisma";
import User from "../types/users.type";
import bcrypt from 'bcrypt'
import crypto from "crypto"
import jwt from "jsonwebtoken"
import RefreshToken from "../types/refresh_tokens.type";
export const login = async (email: string, password: string): Promise<{email: string, username: string}| undefined> =>{
    try{
        if(!email || !password){
            throw new Error("INVALID_FIELDS");
        }
        const user : User | null= await prisma.users.findUnique({
            where: {email}
        })
        if(!user){
            throw new Error("USER_NOT_FOUND")
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return;
        }
        return {email, username: user.username };
    }catch(err){

    }
}
export const deleteOldTokens = async () : Promise<void> =>{
    await prisma.refresh_tokens.deleteMany({
            where:{
                expires_on: {lt: new Date()}
            }
    })
}
export const createTokens = async(email: string) : Promise<{accessToken : string, refreshToken: string} | undefined> =>{
    try{
        const accessToken: string = generateAccessToken(email);
        const refreshToken: string = jwt.sign({email, jti: crypto.randomUUID()}, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });
        await prisma.refresh_tokens.create({
            data: {
                token: refreshToken,
                user_email : email,
                expires_on: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            } 
        })
        return {accessToken, refreshToken}
    }catch(error){

    }
} 
export const getRefreshToken = async(token : string) : Promise<RefreshToken | undefined> =>{
    try{
        const existingToken: RefreshToken | null = await prisma.refresh_tokens.findUnique({
        where:{
            token
        }
        })
        return existingToken ? existingToken : undefined;
    }catch(error){

    }
}

export const generateAccessToken = (email: string): string => {
        return jwt.sign({email}, process.env.ACCESS_TOKEN_SECRET!, {expiresIn: '15min'})
}