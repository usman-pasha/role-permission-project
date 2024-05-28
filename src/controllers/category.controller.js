import * as categoryService from "../services/category.service.js";
import * as logger from "../utils/logs.js";
import * as responser from "../utils/responser.js";

export const addCategory = async (req, res) => {
  logger.info("Creating add category in controller");
  const reqData = req.body;
  const data = await categoryService.addCategory(reqData);
  logger.info(data);
  return responser.send(200, "Category added successfully", req, res, data);
};

export const getCategory = async (req, res) => {
  logger.info("Get category in controller");
  const data = await categoryService.getCategory();
  logger.info(data);
  return responser.send(200, "Category Fetched successfully", req, res, data);
};

export const updateCategory = async (req, res) => {
  logger.info("Update Category in controller");
  const data = await categoryService.updateCategory(req.params.id, req.body);
  logger.info(data);
  return responser.send(200, "Category Updated successfully", req, res, data);
};

export const deleteCategory = async (req, res) => {
  logger.info("Delete category in controller");
  const data = await categoryService.deleteCategory(req.params.id, req.body);
  logger.info(data);
  return responser.send(200, "Category deleted successfully", req, res, data);
};
