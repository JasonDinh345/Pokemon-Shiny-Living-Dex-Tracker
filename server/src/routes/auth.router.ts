import { Router } from "express";
import {getNewToken, login, logout, googleLogin, registerUser, resetPass, sendResetToken, verifyResetToken, verifyEmail } from "../controllers/auth.contoller";
import { validateLogin, validateRegister } from "../middleware/validate";

const authRouter: Router = Router();


authRouter.post("/login", validateLogin, login)
authRouter.post("/login/google", googleLogin)
authRouter.post("/register",validateRegister, registerUser)
authRouter.post("/token", getNewToken)
authRouter.post("/verify-email", verifyEmail)
authRouter.post("/forgot-password", sendResetToken)
authRouter.get("/reset-password", verifyResetToken)
authRouter.post("/reset-password", resetPass)
authRouter.delete("/logout", logout)

export default authRouter;