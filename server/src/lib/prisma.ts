import 'dotenv/config';
import {PrismaClient} from '@prisma/client';

//prisma connection to db
const prisma = new PrismaClient();

export default prisma;
