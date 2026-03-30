import { ENV } from "../config/env";
import { NextFunction, Request, Response } from "express"
import * as userService from "..//services/user.service"
import User from "../types/users.type";
import jwt from "jsonwebtoken"


export const registerUser = async (req: Request, res: Response) => {
    try{
        const {username, email, password} = req.body;
        const addedUser: boolean | undefined = await userService.registerUser(username, email, password);
        if(!addedUser){
            res.json(409).json({error: "Email already in use!"});
            return;
        }
        res.status(201).json({message: "User Created"})
    }catch(err){
        res.status(500).json({error: "Something went wrong!"})
    }

}

export const resetPassword = async (req: Request, res: Response) =>{
    try{
        const {email} = req.body
        await userService.resetPassword(email)
        res.status(202).json({message: "Email sent to the inbox if its in use!"})
    }catch(error){
        res.status(500).json({error: "Something went wrong!"})
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try{
        const user :Partial<User> = req.body
        await userService.updateUser(user)
        res.status(204).json({message: "User data updated!"})
    }catch(error){
        if(error instanceof Error){
            switch(error.message){
                case "USER_NOT_FOUND":
                    res.status(404).json({error: "User not found!"});
                    break;
                case "EMAIL_IN_USE":
                    res.status(409).json({error: "Email already in use"});
            }
        }
        res.status(500).json({error: "Something went wrong!"})
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try{
        const {email} = req.body
        await userService.deleteUser(email);
        res.status(204).json({message: "User deleted!"})
    }catch(error){
        if(error instanceof Error){
            switch(error.message){
                case "USER_NOT_FOUND":
                    res.status(404).json({error: "User not found!"});
                    break;
            }
        }
        res.status(500).json({error: "Something went wrong!"})
    }
}
