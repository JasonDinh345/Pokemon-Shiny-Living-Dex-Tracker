import { describe } from "node:test";
import prisma from "../lib/prisma";
import {server} from "../server"

beforeEach(async () => {
    
    await prisma.$executeRaw`BEGIN`;
    
});
/**
 * Prevents changes to db
 */ 
afterEach(async () => {
    await prisma.$executeRaw`ROLLBACK`;
   
});
describe