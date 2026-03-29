import prisma from "../lib/prisma"
import crypto from 'crypto'
import bcrypt from 'bcrypt';

import { sendResetPassEmail, sendVerificationEmail } from "../utils/email";
import User from "../types/users.type";
import { TOKEN_TYPES } from "../config/token_types";
import { Prisma } from "@prisma/client";
export const registerUser = async(username: string, email: string, password: string): Promise<boolean>  =>{
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
    }catch(error){
      throw new Error();
    }
}
export const resetPassword = async(email: string) =>{
  try{
    const user: User | null= await prisma.users.findUnique({
      where:{email}
    })
    if(!user){
      return;
    }
    const token = crypto.randomBytes(32).toString('hex');
    await prisma.$transaction(async (tx) => {
          await tx.tokens.create({
            data: {
              user_email: email,
              type :TOKEN_TYPES.RESET_PASS,
              expires_on: new Date(Date.now() + 60 * 60 * 1000),
              token
            }
          });
          await sendResetPassEmail(email, token);
        });
  }catch(err){
    throw new Error();
  }
}
export const updateUser = async(user:Partial<User>): Promise<boolean>  =>{
  try{
    if(user.password){
      const hashedPass = await bcrypt.hash(user.password!, 10);
      user.password = hashedPass;
    }
    await prisma.users.update({
      where : {email : user.email!},
      data : user
    })
    return true;
  }catch(error){
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch(error.code){
        case "P2025":
          throw new Error("USER_NOT_FOUND")
        case "P2002":
          throw new Error("EMAIL_IN_USE")
      }
    }
    throw new Error("Failed to update user");
  }
}
export const deleteUser = async(email: string): Promise<boolean> =>{
  try{
    await prisma.users.delete({
      where: { email }
    })
    return true;
  }catch(error){
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch(error.code){
        case "P2025":
          throw new Error("USER_NOT_FOUND")
      }
    }
    throw new Error("Failed to update user");
  }
}