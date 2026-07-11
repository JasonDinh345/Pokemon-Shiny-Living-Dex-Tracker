import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken"
import { NextFunction, Request, Response } from "express"
import { ENV } from '../config/env';
export const authenticateToken =  (req:Request, res: Response, next: NextFunction) =>{
        const accessToken = req.cookies.accessToken;
        
        if(!accessToken){
            res.status(403).json("Token cannot be null or undefined")
            return;
        }
        jwt.verify(accessToken, ENV.ACCESS_TOKEN_SECRET, ((err :VerifyErrors | null, decoded: JwtPayload | string | undefined)=>{
            if(err){
                res.status(401).json({message:"Token can't be verified"})
                return;
            }
            
            req.user = decoded as {email: string}
            next()
        }))
}