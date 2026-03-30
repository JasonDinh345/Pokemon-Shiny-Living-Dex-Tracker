import { Request, Response } from "express";
import CaughtShiny, { ShinyWithCount } from "../types/caught_shinies_type";
import * as caughtShinyService from "../services/caught_shinies.service"

export const addNewShiny = async(req: Request, res: Response) =>{
    try{
        const user = req.user
        const pokemonData = req.body
        const pokemon : CaughtShiny = await caughtShinyService.addNewShiny(pokemonData, user.email)
        res.status(201).json(pokemon)
    }catch(error){
        if(error instanceof Error){
            switch(error.message){
                case "INVALID_FIELDS":
                    res.status(400).json({error: "Invald required fields!"})
                    break;
                case "USER_NOT_FOUND":
                    res.status(404).json({error:"User doesn't exist!"})
                    break;
                case "INVALID_AUTH":
                    res.status(401).json({error:"User not authorized!"})
                    break;
                default:
                    res.status(500).json({error:"Something went wrong!"})
            }
        }

    }
}
export const getAllShiniesOfUser = async(req: Request, res: Response) =>{
    try{
        const user = req.user
        const shinies: ShinyWithCount[] = await caughtShinyService.getAllShiniesOfUser(user.email)
        res.status(200).json(shinies)
    }catch(error){
        if(error instanceof Error){
            switch(error.message){
                case "USER_NOT_FOUND":
                    res.status(404).json({error:"User doesn't exist!"})
                    break;
                case "INVALID_AUTH":
                    res.status(401).json({error:"User not authorized!"})
                    break;
                default:
                    res.status(500).json({error:"Something went wrong!"})
            }
        }
    }
}
export const getShinyOfUser = async(req: Request, res: Response) => {
    try{
        const user = req.user
        const {id} = req.body as {id: number}
        const shiny: CaughtShiny | null = await caughtShinyService.getShinyOfUser(user.email, id)
        if(!shiny){
            res.status(404).json({error: `Unknown Pokemon with ID: ${id}`})
            return;
        }
        res.status(200).json(shiny)
    }catch(error){
        if(error instanceof Error){
            switch(error.message){
                case "USER_NOT_FOUND":
                    res.status(404).json({error:"User doesn't exist!"})
                    break;
                case "INVALID_AUTH":
                    res.status(401).json({error:"User not authorized!"})
                    break;
                default:
                    res.status(500).json({error:"Something went wrong!"})
            }
        }
    }
}
export const updateShiny = async(req: Request, res: Response) =>{
     try{
        const user = req.user
        const data = req.body as Partial<CaughtShiny>
        const updateShiny: CaughtShiny = await caughtShinyService.updateShiny(user.email, data)
        
        res.status(204).json(updateShiny)
    }catch(error){
        if(error instanceof Error){
            switch(error.message){
                case "USER_NOT_FOUND":
                    res.status(404).json({error:"User doesn't exist!"})
                    break;
                case "POKEMON_NOT_FOUND":
                    res.status(404).json({error:"Pokemon doesn't exist!"})
                    break;
                case "INVALID_AUTH":
                    res.status(401).json({error:"User not authorized!"})
                    break;
                default:
                    res.status(500).json({error:"Something went wrong!"})
            }
        }
    }
}
export const deleteShinies = async(req: Request, res: Response) =>{
    try{
        const user = req.user
        const {ids} = req.body as {ids : number[]}
        await caughtShinyService.deleteShinies(user.email, ids)
        
        res.status(204).json({message: "Deleted shinies!"})
    }catch(error){
        if(error instanceof Error){
            switch(error.message){
                case "USER_NOT_FOUND":
                    res.status(404).json({error:"User doesn't exist!"})
                    break;
                case "POKEMON_NOT_FOUND":
                    res.status(404).json({error:"Pokemon doesn't exist!"})
                    break;
                case "INVALID_AUTH":
                    res.status(401).json({error:"User not authorized!"})
                    break;
                default:
                    res.status(500).json({error:"Something went wrong!"})
            }
        }
    }
}