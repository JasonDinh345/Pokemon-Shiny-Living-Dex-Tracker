import { Router } from "express";
import { registerUser, resetPassword, updateUser } from "../controllers/user.controller";
import { authenticateToken } from "../controllers/auth.contoller";
import { deleteUser } from "../services/user.service";

const userRouter: Router = Router();

userRouter.post("/", registerUser)

userRouter.patch("/reset-pass", authenticateToken , resetPassword)

userRouter.patch("/", authenticateToken, updateUser)

userRouter.delete("/", authenticateToken, deleteUser)

export default userRouter;