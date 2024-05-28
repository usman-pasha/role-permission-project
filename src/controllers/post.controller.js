import * as postService from "../services/post.service.js";
import * as logger from "../utils/logs.js";
import * as responser from "../utils/responser.js";

export const addPost = async (req, res) => {
  logger.info("Creating add Post in controller");
  const reqData = req.body;
  const data = await postService.addPost(reqData);
  logger.info(data);
  return responser.send(200, "Post added successfully", req, res, data);
};

export const getPost = async (req, res) => {
  logger.info("Get Post in controller");
  const data = await postService.getPost();
  logger.info(data);
  return responser.send(200, "Post Fetched successfully", req, res, data);
};

export const updatePost = async (req, res) => {
  logger.info("Update Post in controller");
  const data = await postService.updatePost(req.params.id, req.body);
  logger.info(data);
  return responser.send(200, "Post Updated successfully", req, res, data);
};

export const deletePost = async (req, res) => {
  logger.info("Delete Post in controller");
  const data = await postService.deletePost(req.params.id, req.body);
  logger.info(data);
  return responser.send(200, "Post deleted successfully", req, res, data);
};

// like and unlike
export const postLike = async (req, res) => {
  logger.info("Like Post in controller");
  const reqData = req.body;
  reqData.userId = req.userId;
  const data = await postService.postLike(reqData);
  logger.info(data);
  return responser.send(200, "Post Liked successfully", req, res, data);
};

// unlike
export const postUnLike = async (req, res) => {
  logger.info("Un Like Post in controller");
  const reqData = req.body;
  reqData.userId = req.userId;
  const data = await postService.postUnLike(reqData);
  logger.info(data);
  return responser.send(200, "Post UnLiked successfully", req, res, data);
};
// unlike
export const postLikeCounts = async (req, res) => {
  logger.info("Like Post Count in controller");
  const reqData = req.body;
  const data = await postService.postLikeCounts(reqData);
  logger.info(data);
  return responser.send(
    200,
    "Post Total Likes Fetched successfully",
    req,
    res,
    data
  );
};
