import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
const authRouter = Router();
import catchError from "../utils/catchError.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const authEndpoint = {
  register: "/register",
  login: "/login",
  profile: "/profile",
  refreshPermission: "/refresh-permission",
};

authRouter.route("/").get((req, res) => {
  return res.json(authEndpoint);
});

authRouter
  .route(authEndpoint.register)
  .post(catchError(authController.register));

authRouter.route(authEndpoint.login).post(catchError(authController.login));
authRouter
  .route(authEndpoint.profile)
  .get(verifyJWT, catchError(authController.getProfile));

authRouter
  .route(authEndpoint.refreshPermission)
  .get(verifyJWT, catchError(authController.getUserPermission));

export default authRouter;
