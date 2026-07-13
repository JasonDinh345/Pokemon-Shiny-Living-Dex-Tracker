import {Router} from 'express';
import {updateUser, deleteUser} from '../controllers/user.controller';
import {authenticateToken} from '../middleware/authenticate';

const userRouter: Router = Router();
//PATCH ROUTE to update a user
userRouter.patch('/', authenticateToken, updateUser);
//DELETE ROUTE to delete a user
userRouter.delete('/', authenticateToken, deleteUser);

export default userRouter;
