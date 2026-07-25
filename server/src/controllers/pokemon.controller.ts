import {Request, Response} from 'express';
/**
 * gets pokemon data from the pokemon api
 * @param req request from user
 * @param res result of the request
 */
export const getPokemon = async (req: Request, res: Response) => {
    const {name} = req.params;

    try {
        const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!pokemonRes.ok) {
            res.status(404).json({error: 'Pokemon not found!'});
            return;
        }

        const data = await pokemonRes.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({error: 'Something went wrong!'});
    }
};
/**
 * gets generation data from the pokemon api
 * @param req request from user
 * @param res result of the request
 */
export const getGenData = async (req: Request, res: Response) => {
    const {id} = req.params;

    try {
        const genRes = await fetch(`https://pokeapi.co/api/v2/generation/${id}`);
        if (!genRes.ok) {
            res.status(404).json({error: 'Generation not found!'});
            return;
        }

        const data = await genRes.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({error: 'Something went wrong!'});
    }
};
