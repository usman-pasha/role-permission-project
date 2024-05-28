import * as authService from "../services/auth.service.js";
import * as logger from "../utils/logs.js";
import * as responser from "../utils/responser.js";

// 1.register
export const register = async (req, res) => {
  logger.info("Register in controller");
  const reqData = req.body;
  const data = await authService.register(reqData);
  logger.info(data);
  return responser.send(200, "Successfully User Register", req, res, data);
};

//2.login
export const login = async (req, res) => {
  logger.info("Login in controller");
  const reqData = req.body;
  const data = await authService.login(reqData);
  logger.info(data);
  return responser.send(200, "User logged In Successfully", req, res, data);
};

//3.profile
export const getProfile = async (req, res) => {
  logger.info("GET PROFILE in controller");
  const userId = req.userId;
  const data = await authService.getProfile(userId);
  logger.info(data);
  return responser.send(200, "User Profile Fetched Successfully", req, res, data);
};

//4.getUserPermission
export const getUserPermission = async (req, res) => {
  logger.info("GET PROFILE in controller");
  const userId = req.userId;
  const data = await authService.getUserPermission(userId);
  logger.info(data);
  return responser.send(200, "User Permission Fetched Successfully", req, res, data);
};
