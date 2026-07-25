import {Router} from 'express';
import {getGenData, getPokemon} from '../controllers/pokemon.controller';

const pokemonRouter: Router = Router();

export default pokemonRouter;
//GET route to get gen data
pokemonRouter.get('/gen/:id', getGenData);
//GET route to get pokemon  data
pokemonRouter.get('/:name', getPokemon);
