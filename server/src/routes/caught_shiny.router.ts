import {Router} from 'express';
import {authenticateToken} from '../middleware/authenticate';
import {
    addNewShiny,
    deleteShiny,
    getAllShiniesOfUser,
    getShinyOfUser,
    updateShiny,
} from '../controllers/caught_shines.controller';
//Route to access caught shiny pokemon data
const caughtShinyRouter: Router = Router();
//
caughtShinyRouter.get('/all', authenticateToken, getAllShiniesOfUser);
//POST route to insert a shiny into ones collection
caughtShinyRouter.post('/', authenticateToken, addNewShiny);
caughtShinyRouter.get('/:id', authenticateToken, getShinyOfUser);
caughtShinyRouter.patch('/:id', authenticateToken, updateShiny);
caughtShinyRouter.delete('/:id', authenticateToken, deleteShiny);

export default caughtShinyRouter;
