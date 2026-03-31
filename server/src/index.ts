import 'dotenv/config';        
  
import express, { Request, Response } from 'express';
import cors from 'cors';
import authRouter from './routes/auth.router';
import userRouter from './routes/user.router';
import caughtShinyRouter from './routes/caught_shiny.router';



const app = express();

app.use(cors({ 
  origin: 'http://localhost:3000',
  credentials: true,     
 }));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Backend is running!' });
});

app.use("/auth", authRouter)
app.use("/user", userRouter)
app.use("/caugth-shinies", caughtShinyRouter)

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));