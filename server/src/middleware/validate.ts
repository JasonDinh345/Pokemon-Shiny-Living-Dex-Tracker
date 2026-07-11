import { z } from "zod";
import { NextFunction, Request, Response } from "express"
export const registerSchema = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});
export const loginSchema = z.object({
    email: z.email("Invalid email"),
    password: z.string().min(1, "Missing fields!")
});

export const validateRegister =  (req:Request, res: Response, next: NextFunction) =>{
        const result = registerSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({errors: result.error.issues });
        }
        next()
}   

export const validateLogin =  (req:Request, res: Response, next: NextFunction) =>{
        const result = loginSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({errors: result.error.issues });
        }
        next()
}   
    
