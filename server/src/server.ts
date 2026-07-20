import 'dotenv/config';

import express, {Request, Response} from 'express';
import cors from 'cors';
import authRouter from './routes/auth.router';
import userRouter from './routes/user.router';
import caughtShinyRouter from './routes/caught_shiny.router';
import cookieParser from 'cookie-parser';

const server = express();

server.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true
    })
);
server.use(express.json());
server.use(cookieParser());
server.get('/', (req: Request, res: Response) => {
    res.json({message: 'Backend is running!'});
});

server.use('/auth', authRouter);
server.use('/user', userRouter);
server.use('/caught-shinies', caughtShinyRouter);

export {server};
