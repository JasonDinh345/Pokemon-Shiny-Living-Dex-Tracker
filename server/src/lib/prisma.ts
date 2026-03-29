import { ENV } from "../config/env";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaMariaDb({
  host: ENV.DATABASE_HOST,
  user: ENV.DATABASE_USER,
  password: ENV.DATABASE_PASSWORD,
  database: ENV.DATABASE_NAME,
});

const prisma = new PrismaClient({ adapter });

export default prisma;