import { Router } from "express";
import * as categoryController from "../controllers/category.controller.js";
const categoryRouter = Router();
import catchError from "../utils/catchError.js";
import verifyJWT from "../middlewares/auth.middleware.js";

categoryRouter
  .route("/add-category")
  .post(verifyJWT, catchError(categoryController.addCategory));
categoryRouter
  .route("/get-category")
  .get(verifyJWT, catchError(categoryController.getCategory));
categoryRouter
  .route("/update-category/:id")
  .patch(verifyJWT, catchError(categoryController.updateCategory));
categoryRouter
  .route("/delete-category/:id")
  .delete(verifyJWT, catchError(categoryController.deleteCategory));

export default categoryRouter;
