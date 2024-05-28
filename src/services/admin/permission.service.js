import * as logger from "../../utils/logs.js";
import AppError from "../../utils/appError.js";
import { permissionModel } from "../../models/permission.model.js";

export const addPermission = async (body) => {
  logger.info("Creating the add permission");
  const isExists = await permissionModel.findOne({
    permissionName: { $regex: body.permissionName, $options: "i" },
  });
  if (isExists) throw new AppError(400, "Permission Name Already Exists");

  const payload = {
    permissionName: body.permissionName,
  };
  if (body.default) payload.isDefault = parseInt(body.default);
  const record = await permissionModel.create(payload);
  return record;
};

export const getPermission = async (query) => {
  logger.info("Get the Permission");
  const record = await permissionModel.find({});
  return record;
};

export const updatePermission = async (permissionId, body) => {
  logger.info("Update the Permission");
  const isExists = await permissionModel.findOne({ _id: permissionId });
  if (!isExists) throw new AppError(400, "Permission Id Not Found");
  const permissionNameExists = await permissionModel.findOne({
    _id: { $ne: permissionId },
    permissionName: { $regex: body.permissionName, $options: "i" },
  });
  if (permissionNameExists)
    throw new AppError(400, "Already Permission Name Exists");
  const condition = {
    _id: permissionId,
  };
  const updateData = {};
  if (body.permissionName) updateData.permissionName = body.permissionName;
  if (body.default != null) updateData.isDefault = parseInt(body.default);
  const option = { new: true };
  const record = await permissionModel.findOneAndUpdate(
    condition,
    updateData,
    option
  );
  return record;
};

export const deletePermission = async (permissionId) => {
  logger.info("Delete the Permission");
  const condition = {
    _id: permissionId,
  };
  
  const record = await permissionModel.findOneAndDelete(condition);
  return record;
};
