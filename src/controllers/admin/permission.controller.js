import * as permissionService from "../../services/admin/permission.service.js";
import * as logger from "../../utils/logs.js";
import * as responser from "../../utils/responser.js";

export const addPermission = async (req, res) => {
  logger.info("Creating add permission in controller");
  const reqData = req.body;
  const data = await permissionService.addPermission(reqData);
  logger.info(data);
  return responser.send(200, "Permision added successfully", req, res, data);
};

export const getPermission = async (req, res) => {
  logger.info("Get permission in controller");
  const data = await permissionService.getPermission();
  logger.info(data);
  return responser.send(200, "Permision Fetched successfully", req, res, data);
};

export const updatePermission = async (req, res) => {
  logger.info("Update permission in controller");
  const data = await permissionService.updatePermission(
    req.params.id,
    req.body
  );
  logger.info(data);
  return responser.send(200, "Permision Updated successfully", req, res, data);
};

export const deletePermission = async (req, res) => {
  logger.info("Delete permission in controller");
  const data = await permissionService.deletePermission(
    req.params.id,
    req.body
  );
  logger.info(data);
  return responser.send(200, "Permision deleted successfully", req, res, data);
};
