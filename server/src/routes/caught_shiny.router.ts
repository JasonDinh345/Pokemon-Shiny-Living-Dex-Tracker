import { Router } from "express";
import { authenticateToken } from "../controllers/auth.contoller";
import { addNewShiny, deleteShiny, getAllShiniesOfUser, getShinyOfUser, updateShiny } from "../controllers/caught_shines.controller";

const caughtShinyRouter: Router = Router()

caughtShinyRouter.post("/", authenticateToken, addNewShiny)
caughtShinyRouter.get("/all", authenticateToken, getAllShiniesOfUser)
caughtShinyRouter.get("/:id", authenticateToken, getShinyOfUser)
caughtShinyRouter.patch("/:id", authenticateToken, updateShiny)
caughtShinyRouter.delete("/:id", authenticateToken, deleteShiny)

export default caughtShinyRouter