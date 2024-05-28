import { Router } from "express";
import * as adminController from "../controllers/admin/admin.controller.js";
import * as permissionController from "../controllers/admin/permission.controller.js";
import * as roleController from "../controllers/admin/role.controller.js";
const adminRouter = Router();
import catchError from "../utils/catchError.js";
import verifyJWT, { adminAccess } from "../middlewares/auth.middleware.js";

// permissions
adminRouter
  .route("/add-permission")
  .post(verifyJWT, adminAccess, catchError(permissionController.addPermission));
adminRouter
  .route("/get-permission")
  .get(verifyJWT, adminAccess, catchError(permissionController.getPermission));
adminRouter
  .route("/update-permission/:id")
  .patch(
    verifyJWT,
    adminAccess,
    catchError(permissionController.updatePermission)
  );
adminRouter
  .route("/delete-permission/:id")
  .delete(
    verifyJWT,
    adminAccess,
    catchError(permissionController.deletePermission)
  );

// roles
adminRouter
  .route("/store-role")
  .post(verifyJWT, adminAccess, catchError(roleController.addRole));
adminRouter
  .route("/get-roles")
  .get(verifyJWT, adminAccess, catchError(roleController.getRole));

export default adminRouter;
