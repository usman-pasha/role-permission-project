import * as logger from "../utils/logs.js";
import AppError from "../utils/appError.js";
import { postModel } from "../models/post.model.js";
import { categoryModel } from "../models/category.model.js";
import { likeModel } from "../models/like.model.js";

import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const addPost = async (body) => {
  logger.info("Creating the add Post");
  if (!body.title) throw new AppError(400, "Required Post Title");
  let categories = [];
  if (body.categories) {
    body.categories = body.categories.map((e) => new ObjectId(e));
    const query = {
      _id: { $in: body.categories },
    };
    const projection = { _id: 1 };
    categories = await categoryModel.find(query, projection);
  }
  const payload = {
    title: body.title,
    discription: body.discription,
    categories: categories,
  };
  const post = await postModel.create(payload);
  const record = await postModel
    .findOne({ _id: post._id })
    .populate([{ path: "categories", select: ["_id", "categoryName"] }]);
  return record;
};

export const getPost = async (query) => {
  logger.info("Get the Post");
  const record = await postModel
    .find({})
    .populate([{ path: "categories", select: ["_id", "categoryName"] }]);
  return record;
};

export const updatePost = async (postId, body) => {
  logger.info("Update the Post");
  const isExists = await postModel.findOne({ _id: postId });
  if (!isExists) throw new AppError(400, "Post Id Not Found");
  const condition = {
    _id: postId,
  };
  const updateData = {};
  if (body.title) updateData.title = body.title;
  if (body.discription) updateData.discription = body.discription;
  if (body.categories) {
    let categories = [];
    body.categories = body.categories.map((e) => new ObjectId(e));
    const query = { _id: { $in: body.categories } };
    const projection = { _id: 1 };
    categories = await categoryModel.find(query, projection);
    updateData.categories = categories;
  }
  const option = { new: true };
  const postUpdated = await postModel.findOneAndUpdate(
    condition,
    updateData,
    option
  );
  const record = await postModel
    .findOne({ _id: postUpdated._id })
    .populate([{ path: "categories", select: ["_id", "categoryName"] }]);
  return record;
};

export const deletePost = async (postId) => {
  logger.info("Delete the Post");
  const condition = {
    _id: postId,
  };
  const cate = await postModel.findOne(condition);
  if (!cate) throw new AppError(400, "Post Not Found");
  const record = await postModel.findOneAndDelete(condition);
  return record;
};

// like post
export const postLike = async (body) => {
  logger.info("Post Like");
  const isLiked = await likeModel.findOne({
    $and: [{ userId: body.userId }, { postId: body.postId }],
  });
  if (isLiked) throw new AppError(400, "Already You Liked");
  const payload = {
    userId: body.userId,
    postId: body.postId,
  };
  const record = await likeModel.create(payload);
  return record;
};

// unlike post
export const postUnLike = async (body) => {
  logger.info("Post UNLike");
  const isLiked = await likeModel.findOne({
    $and: [{ userId: body.userId }, { postId: body.postId }],
  });
  if (!isLiked) throw new AppError(400, "You Have Not Liked");
  const payload = {
    userId: body.userId,
    postId: body.postId,
  };
  const record = await likeModel.deleteOne(payload);
  return record;
};

// like counts
export const postLikeCounts = async (body) => {
  logger.info("Post Like counts");
  const likeCounts = await likeModel
    .find({ postId: body.postId })
    .countDocuments();
  if (!likeCounts) throw new AppError(400, "Currently Zero Likes");
  return likeCounts;
};
