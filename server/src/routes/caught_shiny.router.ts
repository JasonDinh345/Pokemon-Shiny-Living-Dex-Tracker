import {Router} from 'express';
import {authenticateToken} from '../middleware/authenticate';
import {
    addNewShiny,
    deleteShiny,
    getAllShiniesOfUser,
    getShinyOfUser,
    updateShiny
} from '../controllers/caught_shines.controller';
//Route to access caught shiny pokemon data
const caughtShinyRouter: Router = Router();
//GET route to retrieve all shinies of a user
caughtShinyRouter.get('/all', authenticateToken, getAllShiniesOfUser);
//GET route to retrieve a shiny of a user
caughtShinyRouter.get('/:id', authenticateToken, getShinyOfUser);
//POST route to insert a shiny into ones collection
caughtShinyRouter.post('/', authenticateToken, addNewShiny);
//PATCH ROUTE to update a shiny in a users collection
caughtShinyRouter.patch('/:id', authenticateToken, updateShiny);
//DELETE ROUTE to delete a shiny in a users collection
caughtShinyRouter.delete('/:id', authenticateToken, deleteShiny);

export default caughtShinyRouter;
