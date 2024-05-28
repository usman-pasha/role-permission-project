import { Router } from "express";
import * as postController from "../controllers/post.controller.js";
const postRouter = Router();
import catchError from "../utils/catchError.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/checkPermission.middleware.js"

postRouter
  .route("/add-post")
  .post(verifyJWT, catchError(postController.addPost));
postRouter
  .route("/get-post")
  .get(verifyJWT, checkPermission, catchError(postController.getPost));
postRouter
  .route("/update-post/:id")
  .patch(verifyJWT, catchError(postController.updatePost));
postRouter
  .route("/delete-post/:id")
  .delete(verifyJWT, catchError(postController.deletePost));

// like
postRouter
  .route("/post-like")
  .post(verifyJWT, catchError(postController.postLike));
postRouter
  .route("/post-unlike")
  .post(verifyJWT, catchError(postController.postUnLike));
postRouter
  .route("/post-like-count")
  .post(verifyJWT, catchError(postController.postLikeCounts));

export default postRouter;
