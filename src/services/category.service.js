import * as logger from "../utils/logs.js";
import AppError from "../utils/appError.js";
import { categoryModel } from "../models/category.model.js";

export const addCategory = async (body) => {
  logger.info("Creating the add Category");
  if (!body.categoryName) throw new AppError(400, "Required Category Name");
  const isExists = await categoryModel.findOne({
    categoryName: { $regex: body.categoryName, $options: "i" },
  });
  if (isExists) throw new AppError(400, "Category Name Already Exists");

  const payload = {
    categoryName: body.categoryName,
  };
  const record = await categoryModel.create(payload);
  return record;
};

export const getCategory = async (query) => {
  logger.info("Get the Category");
  const record = await categoryModel.find({});
  return record;
};

export const updateCategory = async (categoryId, body) => {
  logger.info("Update the Category");
  const isExists = await categoryModel.findOne({ _id: categoryId });
  if (!isExists) throw new AppError(400, "Category Id Not Found");
  const categoryNameExists = await categoryModel.findOne({
    _id: { $ne: categoryId },
    categoryName: { $regex: body.categoryName, $options: "i" },
  });
  if (categoryNameExists)
    throw new AppError(400, "Already Category Name Exists");
  const condition = {
    _id: categoryId,
  };
  const updateData = {};
  if (body.categoryName) updateData.categoryName = body.categoryName;
  const option = { new: true };
  const record = await categoryModel.findOneAndUpdate(
    condition,
    updateData,
    option
  );
  return record;
};

export const deleteCategory = async (categoryId) => {
  logger.info("Delete the Category");
  const condition = {
    _id: categoryId,
  };
  const cate = await categoryModel.findOne(condition);
  if (!cate) throw new AppError(400, "Category Not Found");
  const record = await categoryModel.findOneAndDelete(condition);
  return record;
};
