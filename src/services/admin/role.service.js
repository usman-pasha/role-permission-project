import * as logger from "../../utils/logs.js";
import AppError from "../../utils/appError.js";
import { roleModel } from "../../models/roles.model.js";

export const addRole = async (body) => {
  logger.info("Creating the add role");
  console.log(body);
  if (!body.roleName)
    throw new AppError(400, "Required Parameters");

  const isExists = await roleModel.findOne({
    roleName: { $regex: body.roleName, $options: "i" },
  });
  if (isExists) throw new AppError(400, "Role Name Already Exists");

  const payload = {
    roleName: body.roleName,
    value: body.value,
  };
  const record = await roleModel.create(payload);
  return record;
};

export const getRole = async (query) => {
  logger.info("Get the Role");
  //admin 1 so dont show admin data
  const record = await roleModel.find({ value: { $ne: 1 } });
  return record;
};
