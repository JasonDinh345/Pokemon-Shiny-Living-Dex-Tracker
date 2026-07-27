import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.router';
import userRouter from './routes/user.router';
import caughtShinyRouter from './routes/caught_shiny.router';
import cookieParser from 'cookie-parser';
import pokemonRouter from './routes/pokemon.router';

const server = express();

server.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true
    })
);
server.use(express.json());
server.use(cookieParser());

server.use('/pokemon', pokemonRouter);
server.use('/auth', authRouter);
server.use('/user', userRouter);
server.use('/caught-shinies', caughtShinyRouter);

export {server};
