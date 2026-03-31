import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";
import CaughtShiny, { ShinyWithCount } from "../types/caught_shinies_type";

export const addNewShiny = async(pokemon: Omit<CaughtShiny, "id">, email: string): Promise<CaughtShiny>=>{
    try{
        if(!pokemon.pokemon_name || !pokemon.game || !pokemon.method){
            throw new Error("INVALID_FIELDS")
        }else if(!email){
            throw new Error("INVALID_AUTH")
        }
        const addedPokemon: CaughtShiny = await prisma.caught_shinies.create({
            data: {...pokemon, user_email: email}
        })
        return addedPokemon;
    }catch(error){
        if(error instanceof Prisma.PrismaClientKnownRequestError){
            switch(error.code){
                case "P2003":
                    throw new Error("USER_NOT_FOUND");
            }
        }else if (error instanceof Error){
            throw new Error(error.message);
        }
        throw new Error();
    }
}
export const getAllShiniesOfUser = async(email: string):Promise<ShinyWithCount[]> =>{
    try{
        if(!email){
            throw new Error("INVALID_AUTH")
        }
        const shinies: CaughtShiny[] = await prisma.caught_shinies.findMany({
            where:{user_email: email},
            omit: {
                user_email: true,
            }
        })
        const shiniesWCount = shinies.reduce<Record<string, ShinyWithCount>>((acc, shiny) =>{
            const key = shiny.pokemon_name
            if(!acc[key]){
                acc[key] = {...shiny, count: 0}
            }
            acc[key].count++;
            return acc
        }, {})
        return Object.values(shiniesWCount);
    }catch(error){
         if(error instanceof Prisma.PrismaClientKnownRequestError){
            switch(error.code){
                case "P2003":
                    throw new Error("USER_NOT_FOUND");
            }
        }else if (error instanceof Error){
            throw new Error(error.message)
        }
        throw new Error();
    }
}
export const getShinyOfUser = async(email: string, id: number):Promise<CaughtShiny | null> =>{
    try{
        if(!email){
            throw new Error("INVALID_AUTH")
        }
        const shiny: CaughtShiny | null  = await prisma.caught_shinies.findUnique({
            where:{user_email:email, id},
            omit:{
                user_email: true
            }
        })
        return shiny
    }catch(error){
        if(error instanceof Prisma.PrismaClientKnownRequestError){
            switch(error.code){
                case "P2003":
                    throw new Error("USER_NOT_FOUND");
            }
        }else if (error instanceof Error){
            throw new Error(error.message)
        }
        throw new Error();
    }
}
export const updateShiny = async(email: string, pokemon: Partial<Omit<CaughtShiny, "id">>, id: number): Promise<CaughtShiny>=>{
    try{
        
        const updatedPokemon: CaughtShiny = await prisma.caught_shinies.update({
            where:{id, user_email: email},
            data: pokemon,
            omit:{
                user_email : true
            }
        })
        return updatedPokemon
    }catch(error){
        if(error instanceof Prisma.PrismaClientKnownRequestError){
            switch(error.code){
                case "P2025":
                    throw new Error("POKEMON_NOT_FOUND");
                case "P2003":
                    throw new Error("USER_NOT_FOUND");
            }
        }else if(error instanceof Error){
            throw new Error(error.message);
        }
        throw new Error();
    }
}
export const deleteShiny = async(email: string, id: number):Promise<void> =>{
    try{
        await prisma.caught_shinies.delete({
            where: {user_email: email, id}
        })
    }catch(error){
        if(error instanceof Prisma.PrismaClientKnownRequestError){
            switch(error.code){
                case "P2003":
                    throw new Error("USER_NOT_FOUND");
            }
        }
        throw new Error();
    }
}