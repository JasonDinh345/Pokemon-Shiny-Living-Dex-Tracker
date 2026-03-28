import { Request, Response } from "express"
import prisma from "../lib/prisma"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';
export const registerUser = async (req: Request, res: Response) => {
    const {username, email, password} = req.body;
    const existingUser = await prisma.users.findUnique({
        where: {email}
    })
    if(existingUser){
        return res.json(400).json({error: "Email already in use!"})
    }
    const hashedPass = await bcrypt.hash(password!, 10);
    const user = await prisma.users.create({
        data:{
            username,
            email,
            password : hashedPass
        }
    }) 
    res.json({message: "User Created", user})

}