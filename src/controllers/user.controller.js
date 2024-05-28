import * as userService from "../services/user.service.js";
import * as logger from "../utils/logs.js";
import * as responser from "../utils/responser.js";

export const createUser = async (req, res) => {
  logger.info("Creating user in controller");
  const reqData = req.body;
  reqData.userId = req.userId;
  const data = await userService.createUser(reqData);
  logger.info(data);
  return responser.send(200, "User added successfully", req, res, data);
};

export const getUser = async (req, res) => {
  logger.info("Get user in controller");
  const data = await userService.getUsers(req.userId);
  logger.info(data);
  return responser.send(200, "User fetched successfully", req, res, data);
};

export const updateUser = async (req, res) => {
  logger.info("Update user in controller");
  const reqData = req.body;
  reqData.userId = req.userId;
  const params = req.params;
  const data = await userService.updateUser(params?.id, reqData);
  logger.info(data);
  return responser.send(200, "User Update successfully", req, res, data);
};

export const deleteUser = async (req, res) => {
  logger.info("Delete user in controller");
  const params = req.params;
  const data = await userService.deleteUser(params?.id);
  logger.info(data);
  return responser.send(200, "User deleted successfully", req, res, data);
};
