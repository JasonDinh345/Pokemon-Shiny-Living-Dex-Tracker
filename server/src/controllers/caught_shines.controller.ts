import {Request, Response} from 'express';
import CaughtShiny from '../types/caught_shinies_type';
import * as caughtShinyService from '../services/caught_shinies.service';

/**
 * Gets all shinies of a user
 * @param req request from user
 * @param res result of the request
 */
export const getAllShiniesOfUser = async (req: Request, res: Response) => {
    try {
        const {email} = req.user!;
        const shinies: CaughtShiny[] = await caughtShinyService.getAllShiniesOfUser(email);
        res.status(200).json(shinies);
    } catch (error) {
        if (error instanceof Error) {
            switch (error.message) {
                default:
                    res.status(500).json({error: 'Something went wrong!'});
            }
        }
    }
};
/**
 * Gets a specific shiny from a user
 * @param req request from user
 * @param res result of the request
 */
export const getShinyOfUser = async (req: Request, res: Response) => {
    try {
        const {email} = req.user!;
        const {id} = req.params;
        const shiny: CaughtShiny | null = await caughtShinyService.getShinyOfUser(
            email,
            Number(id)
        );
        if (!shiny) {
            res.status(404).json({error: `Unknown Pokemon with ID: ${id}`});
            return;
        }
        res.status(200).json(shiny);
    } catch (error) {
        if (error instanceof Error) {
            switch (error.message) {
                default:
                    res.status(500).json({error: 'Something went wrong!'});
            }
        }
    }
};
/**
 * Adds new shiny to user's collection
 * @param req request from user
 * @param res result of the request
 */
export const addNewShiny = async (req: Request, res: Response) => {
    try {
        const {email} = req.user!;
        const pokemonData = req.body;
        const pokemon: CaughtShiny = await caughtShinyService.addNewShiny(pokemonData, email);
        res.status(201).json(pokemon);
    } catch (error) {
        if (error instanceof Error) {
            switch (error.message) {
                case 'INVALID_FIELDS':
                    res.status(400).json({error: 'Invald required fields!'});
                    break;
                default:
                    res.status(500).json({error: 'Something went wrong!'});
            }
        }
    }
};
/**
 * Updates a shiny of a user
 * @param req request from user
 * @param res result of the request
 */
export const updateShiny = async (req: Request, res: Response) => {
    try {
        const {email} = req.user!;
        const {id} = req.params;
        const data = req.body as Partial<CaughtShiny>;
        const updateShiny: CaughtShiny = await caughtShinyService.updateShiny(
            email,
            data,
            Number(id)
        );
        res.status(200).json(updateShiny);
    } catch (error) {
        if (error instanceof Error) {
            switch (error.message) {
                case 'POKEMON_NOT_FOUND':
                    res.status(404).json({error: "Pokemon doesn't exist!"});
                    break;
                default:
                    res.status(500).json({error: 'Something went wrong!'});
            }
        }
    }
};
/**
 * Deletes a specifc shiny from a user's collection
 * @param req request from user
 * @param res result of the request
 */
export const deleteShiny = async (req: Request, res: Response) => {
    try {
        const {email} = req.user!;
        const {id} = req.params;
        await caughtShinyService.deleteShiny(email, Number(id));

        res.status(204).json({message: 'Deleted shinies!'});
    } catch (error) {
        if (error instanceof Error) {
            switch (error.message) {
                case 'USER_NOT_FOUND':
                    res.status(404).json({error: "User doesn't exist!"});
                    break;
                case 'POKEMON_NOT_FOUND':
                    res.status(404).json({error: "Pokemon doesn't exist!"});
                    break;
                case 'INVALID_AUTH':
                    res.status(401).json({error: 'User not authorized!'});
                    break;
                default:
                    res.status(500).json({error: 'Something went wrong!'});
            }
        }
    }
};
