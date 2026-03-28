import prisma from "../lib/prisma"
import crypto from 'crypto'
import bcrypt from 'bcrypt';

import { sendVerificationEmail } from "../utils/email";
import User from "../types/users.type";
export const registerUser = async(username: string, email: string, password: string): Promise<boolean | undefined>  =>{
  try{
    const existingUser: User | null = await prisma.users.findUnique({
        where: {email}
    })
    if(existingUser){
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
              verification_tokens: {
                create: { 
                    token, 
                    expires_on: new Date(Date.now() + 24 * 60 * 60 * 1000)
                }
              }
            }
          });
          await sendVerificationEmail(email, token);
        });
        return true;
    }catch(error){
      throw error;
    }
}