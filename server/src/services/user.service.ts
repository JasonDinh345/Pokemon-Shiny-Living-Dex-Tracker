import prisma from "../lib/prisma"
import bcrypt from 'bcrypt';
import User from "../types/users.type";
import { Prisma } from "@prisma/client";
export const findUserByEmail = async(email: string): Promise<User | null> =>{
  try{
    const existingUser: User | null = await prisma.users.findUnique({
        where: {email}
    })
    return existingUser
  }catch(err){
    throw new Error();
  }
}

export const updateUser = async(user:Partial<User>, email: string): Promise<boolean>  =>{
  try{
    if(!email){
      throw new Error("NOT_AUTH")
    }
    const {password, ...userData} = user;
    await prisma.users.update({
      where : {email : user.email!},
      data : userData 
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
    }else if (error instanceof Error){
      throw new Error(error.message)
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
          throw new Error("NOT_AUTH")
      }
    }
    throw new Error("Failed to update user");
  }
}