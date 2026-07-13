import {z} from 'zod';
import {NextFunction, Request, Response} from 'express';

//schema to validate user data to register
export const registerSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    email: z.email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

/**
 * validiates the data to register a user
 * @param req request from the user
 * @param res result of the request
 * @param next if successful, continues to request
 */
export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({errors: result.error.issues});
    }
    next();
};
//schema to validate login data
export const loginSchema = z.object({
    email: z.email('Invalid email'),
    password: z.string().min(1, 'Missing fields!'),
});
/**
 * validiates the data to login a user
 * @param req request from the user
 * @param res result of the request
 * @param next if successful, continues to request
 */
export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({errors: result.error.issues});
    }
    next();
};
