import { Router } from "express";
import {getNewToken, login, logout, googleLogin } from "../controllers/auth.contoller";

const authRouter: Router = Router();

authRouter.post("/login", login)
authRouter.post("/login/google", googleLogin )
authRouter.post("/token", getNewToken)
authRouter.delete("/logout", logout)

export default authRouter;