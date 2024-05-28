import { Router } from "express";
import * as routesController from "../controllers/admin/router.controller.js";
const routeRouter = Router();
import catchError from "../utils/catchError.js";
import verifyJWT, { adminAccess } from "../middlewares/auth.middleware.js";

// permissions

routeRouter.use(verifyJWT)
routeRouter.use(adminAccess)
routeRouter
    .route("/all-routes")
    .get(catchError(routesController.getAllRoutes));

routeRouter
    .route("/add-route-permission")
    .post(catchError(routesController.addRoutePermission));

routeRouter
    .route("/get-route-permission")
    .post(catchError(routesController.getRoutePermissions));

export default routeRouter
