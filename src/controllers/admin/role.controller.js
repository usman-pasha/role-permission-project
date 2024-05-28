import * as roleService from "../../services/admin/role.service.js";
import * as logger from "../../utils/logs.js";
import * as responser from "../../utils/responser.js";

export const addRole = async (req, res) => {
  logger.info("Creating add role in controller");
  const reqData = req.body;
  const data = await roleService.addRole(reqData);
  logger.info(data);
  return responser.send(200, "Role added successfully", req, res, data);
};

export const getRole = async (req, res) => {
  logger.info("Get Role in controller");
  const data = await roleService.getRole();
  logger.info(data);
  return responser.send(200, "Role Fetched successfully", req, res, data);
};
