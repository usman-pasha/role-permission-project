import { userModel } from "../models/user.model.js";
import { permissionModel } from "../models/permission.model.js";
import { userPermissionModel } from "../models/userPermission.model.js";
import * as logger from "../utils/logs.js";
import AppError from "../utils/appError.js";
import crypto from "crypto";
import * as sign from "../middlewares/token.middleware.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const createRecord = async (object) => {
  const record = await userModel.create(object);
  return record;
};

export const findOneWithOutPassword = async (condition, populateQuery) => {
  const record = await userModel
    .findOne(condition)
    .populate(populateQuery)
    .select("-password -__v");
  return record;
};

export const findOneWithPassword = async (condition, populateQuery) => {
  const record = await userModel.findOne(condition).populate(populateQuery);
  return record;
};

export const findAllRecord = async (condition, populateQuery) => {
  const record = await userModel
    .find(condition)
    .populate(populateQuery)
    .select("-password");
  return record;
};

export const updateRecord = async (condition, updateQuery) => {
  const option = { new: true };
  const record = await userModel.findByIdAndUpdate(
    condition,
    updateQuery,
    option
  );
  return record;
};

const generateUniqueId = (bytes) => {
  return crypto.randomBytes(bytes).toString("hex");
};

// create User like sub-admin editor or user
export const createUser = async (body) => {
  logger.info("Creating user");
  if (!body.username) throw new AppError(400, "Required username");
  if (!body.email) throw new AppError(400, "Required email");
  if (!body.phoneNumber) throw new AppError(400, "Required phoneNumber");
  const isExists = await findOneWithOutPassword({
    $or: [{ email: body.email }, { username: body.username }],
  });
  if (isExists) throw new AppError(400, "Already username and email exits");
  if (body.role && body.role == 1) {
    throw new AppError(400, `You can't create admin role `);
  }
  const randomPassword = generateUniqueId(3);
  logger.data("Password", randomPassword);
  const password = await sign.encrypted(randomPassword);
  const payload = {
    username: body.username,
    email: body.email,
    password: password,
    createdBy: body.userId,
    updatedBy: body.userId,
  };
  if (body.phoneNumber) payload.phoneNumber = body.phoneNumber;
  if (body.firstName) payload.firstName = body.firstName;
  if (body.lastName) payload.lastName = body.lastName;
  if (body.role) payload.role = body.role;
  const createdUser = await createRecord(payload);
  const record = await findOneWithOutPassword({ _id: createdUser._id });
  // Add Permissions to user 
  if (body.permissions !== undefined && body.permissions.length > 0) {
    let permissionArray = [];
    // Use Promise.all to handle the async operations in map function
    const permissionPromises = body.permissions.map(async (p) => {
      const permissionData = await permissionModel.findOne({ _id: p.id });
      return {
        permissionName: permissionData.permissionName,
        permissionValue: p.value
      };
    });
    // Await for all the promises to resolve
    permissionArray = await Promise.all(permissionPromises);
    await userPermissionModel.create({
      userId: createdUser._id,
      permissions: permissionArray
    });
  }

  // TODO implement email functionality
  return record;
};

export const getUsers = async (userId) => {
  logger.info(`Get All Users`);
  const record = await userModel.aggregate([
    {
      $match: { _id: { $ne: new ObjectId(userId) } },
    },
    {
      $lookup: {
        from: "userpermissions",
        localField: "_id",
        foreignField: "userId",
        as: "permissions",
      },
    },
    {
      $project: {
        _id: 1,
        username: 1,
        email: 1,
        phoneNumber: 1,
        role: 1,
        permissions: {
          $cond: {
            if: { $isArray: "$permissions" },
            then: { $arrayElemAt: ["$permissions", 0] },
            else: null,
          },
        },
      },
    },
    {
      $addFields: {
        permissions: {
          permissions: {
            $map: {
              input: "$permissions.permissions",
              as: "permission",
              in: {
                permissionName: "$$permission.permissionName",
                permissionValue: "$$permission.permissionValue",
              },
            },
          },
        },
      },
    },
    {
      $project: {
        "permissions.userId": 0,
        "permissions.__v": 0,
        "permissions.createdAt": 0,
        "permissions.updatedAt": 0,
      },
    },
  ]);
  if (!record) throw new AppError(400, "User Not Found");
  return record;
};

export const updateUser = async (userId, body) => {
  logger.info("User is Getting to update");
  const user = await findOneWithOutPassword({ _id: userId });
  if (!user) throw new AppError(400, `User Not Found For Id ${userId}`);
  const condition = {
    _id: user._id,
  };
  const updateData = {
    updatedBy: body.userId,
  };

  if (body.username) {
    const userNameExists = await findOneWithOutPassword({
      _id: { $ne: user._id },
      username: { $regex: body.username, $options: "i" },
    });
    if (userNameExists) {
      throw new AppError(400, "User with this username already exists.");
    }
    updateData.username = body.username
  };
  if (body.phoneNumber) {
    const phoneNumberExists = await findOneWithOutPassword({
      _id: { $ne: user._id },
      phoneNumber: body.phoneNumber,
    });

    if (phoneNumberExists) {
      throw new AppError(400, "User with this phone Number already exists.");
    }
    updateData.phoneNumber = body.phoneNumber
  };
  if (body.firstName) updateData.firstName = body.firstName;
  if (body.lastName) updateData.lastName = body.lastName;
  if (body.role) updateData.role = body.role;
  // add or update permission
  let permissionArray = [];
  let permission = `User Not Updated Permission`
  if (body.permissions !== undefined && body.permissions.length > 0) {
    const permissionPromises = body.permissions.map(async (p) => {
      const permissionData = await permissionModel.findOne({ _id: p.id });
      return {
        permissionName: permissionData.permissionName,
        permissionValue: p.value
      };
    });
    permissionArray = await Promise.all(permissionPromises);
    permission = await userPermissionModel.findOneAndUpdate({ userId: user.id },
      { permissions: permissionArray }, { upsert: true, setDefaultsOnInsert: true, new: true })
      .select("-__v -updatedAt -createdAt")
  }

  const userRecord = await updateRecord(condition, updateData);
  userRecord.password = undefined;
  // todo implement one aggregation
  const record = {
    ...userRecord._doc,
    permission
  }

  return record;
};

export const deleteUser = async (userId) => {
  logger.info("User delete");
  const condition = {
    _id: userId,
  };
  const user = await findOneWithOutPassword(condition);
  if (!user) throw new AppError(400, "user Not Found");
  const record = await userModel.findOneAndDelete(condition);
  return record;
};
