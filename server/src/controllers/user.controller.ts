import { Request, Response } from "express"
import * as userService from "..//services/user.service"

export const registerUser = async (req: Request, res: Response) => {
    try{
        const {username, email, password} = req.body;
        const addedUser: boolean | undefined = await userService.registerUser(username, email, password);
        if(!addedUser){
            res.json(400).json({error: "Email already in use!"});
            return;
        }
        res.status(201).json({message: "User Created"})
    }catch(err){
        res.status(500).json({error: "Something went wrong!"})
    }

}
