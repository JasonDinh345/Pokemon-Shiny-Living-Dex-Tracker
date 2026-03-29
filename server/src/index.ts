import 'dotenv/config';        
import { ENV } from './config/env';  
import express, { Request, Response } from 'express';
import cors from 'cors';




const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Backend is running!' });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));