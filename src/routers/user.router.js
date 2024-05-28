import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
const userRouter = Router();
import catchError from "../utils/catchError.js";
import verifyJWT from "../middlewares/auth.middleware.js";

userRouter
  .route("/create-user")
  .post(verifyJWT, catchError(userController.createUser));
userRouter
  .route("/get-users")
  .get(verifyJWT, catchError(userController.getUser));
userRouter
  .route("/update-user/:id")
  .patch(verifyJWT, catchError(userController.updateUser));
userRouter
  .route("/delete-user/:id")
  .delete(verifyJWT, catchError(userController.deleteUser));

export default userRouter;
