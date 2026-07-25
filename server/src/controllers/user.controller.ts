import {Request, Response} from 'express';
import * as userService from '..//services/user.service';

/**
 * updates a user
 * @param req request from user
 * @param res result of the request
 */
export const changeUsername = async (req: Request, res: Response) => {
    try {
        const {email} = req.user!;
        const {username} = req.body;
        if (!username) {
            res.status(400).json({error: 'No username provided!'});
            return;
        }
        await userService.changeUsername(username, email);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({error: 'Something went wrong!'});
    }
};
/**
 * Deletes a user
 * @param req request from user
 * @param res result of the request
 */
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const {email} = req.user!;
        await userService.deleteUser(email);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({error: 'Something went wrong!'});
    }
};
