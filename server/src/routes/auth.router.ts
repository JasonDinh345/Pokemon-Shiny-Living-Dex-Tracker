import {Router} from 'express';
import {
    getNewToken,
    login,
    logout,
    googleLogin,
    registerUser,
    resetPass,
    sendResetToken,
    verifyResetToken,
    verifyEmail,
} from '../controllers/auth.contoller';
import {validateLogin, validateRegister} from '../middleware/validate';
//router for the auth route
const authRouter: Router = Router();
//POST route to login a user
authRouter.post('/login', validateLogin, login);
//POST route to login a user with Google
authRouter.post('/login/google', googleLogin);
//POST route to register a user
authRouter.post('/register', validateRegister, registerUser);
//POST route to verify a user
authRouter.post('/verify-email', verifyEmail);
//POST route to request to reset a users password
authRouter.post('/forgot-password', sendResetToken);
//GET route to verify request to reset password
authRouter.get('/reset-password', verifyResetToken);
//PATCH route to reset password
authRouter.patch('/reset-password', resetPass);
//POST route to get a new access token
authRouter.post('/token', getNewToken);
//DELETE route to logout a user
authRouter.delete('/logout', logout);

export default authRouter;
