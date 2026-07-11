import { Router } from "express";
import { updateUser, deleteUser } from "../controllers/user.controller";
import { authenticateToken } from "../middleware/authenticate";

const userRouter: Router = Router();


userRouter.patch("/", authenticateToken, updateUser)

userRouter.delete("/", authenticateToken, deleteUser)

export default userRouter;