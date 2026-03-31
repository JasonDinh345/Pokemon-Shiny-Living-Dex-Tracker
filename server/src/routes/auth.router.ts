import { Router } from "express";
import {getNewToken, login, logout } from "../controllers/auth.contoller";

const authRouter: Router = Router();

authRouter.post("/login", login)
authRouter.post("/token", getNewToken)
authRouter.delete("/logout", logout)

export default authRouter;