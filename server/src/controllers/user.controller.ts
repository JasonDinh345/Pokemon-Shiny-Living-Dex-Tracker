
import {Request, Response } from "express"
import * as userService from "..//services/user.service"
import User from "../types/users.type";



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
        const {email} = req.user!
        await userService.resetPassword(email)
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

export const updateUser = async (req: Request, res: Response) => {
    try{
        const {email} = req.user!
        const data :Partial<User> = req.body
        await userService.updateUser(data, email)
        res.status(204).json({message: "User data updated!"})
    }catch(error){
        if(error instanceof Error){
            switch(error.message){
                case "USER_NOT_FOUND":
                    res.status(404).json({error: "User not found!"});
                    return;
                case "EMAIL_IN_USE":
                    res.status(409).json({error: "Email already in use"});
                    return;
                 case "NOT_AUTH":
                    res.status(401).json({error:"Not authorized!"})
                    return;
            }
        }
        res.status(500).json({error: "Something went wrong!"})
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try{
        const {email} = req.user!
        await userService.deleteUser(email);
        res.status(204).json({message: "User deleted!"})
    }catch(error){
        if(error instanceof Error){
            switch(error.message){
                case "NOT_AUTH":
                    res.status(401).json({error: "Not authorized!"});
                    break;
            }
        }
        res.status(500).json({error: "Something went wrong!"})
    }
}
