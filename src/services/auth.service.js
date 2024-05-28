import * as userService from "./user.service.js";
import * as logger from "../utils/logs.js";
import * as signToken from "../middlewares/token.middleware.js";
import AppError from "../utils/appError.js";
import { permissionModel } from "../models/permission.model.js";
import { userPermissionModel } from "../models/userPermission.model.js";
import { userModel } from "../models/user.model.js";
import { userPermissions } from "../middlewares/permission.middleware.js"

// register
export const register = async (body) => {
  logger.info("Register started in service");
  if (!body.email || !body.phoneNumber || !body.username || !body.password) {
    throw new AppError(400, "Required Parameters!");
  }
  const existedUser = await userService.findOneWithPassword({
    $or: [{ username: body.username }, { email: body.email }],
  });

  if (existedUser) {
    throw new AppError(409, "User with email or username already exists");
  }
  const password = await signToken.encrypted(body.password);
  const payload = {
    email: body.email,
    username: body.username.toLowerCase(),
    password: password,
  };
  if (body.firstName) payload.firstName = body.firstName;
  if (body.lastName) payload.lastName = body.lastName;
  if (body.phoneNumber) payload.phoneNumber = Number(body.phoneNumber);

  const record = await userService.createRecord(payload);
  const createdUser = await userService.findOneWithOutPassword({
    _id: record._id,
  });

  // assign default permissions
  const defaultPermissions = await permissionModel.find({
    isDefault: 1,
  });
  if (defaultPermissions.length > 0) {
    const permissionArray = [];
    defaultPermissions.forEach((permission) => {
      permissionArray.push({
        permissionName: permission.permissionName,
        permissionValue: [0, 1, 2, 3],
      });
    });
    await userPermissionModel.create({
      userId: createdUser._id,
      permissions: permissionArray,
    });
  }
  return createdUser;
};

// login
export const login = async (body) => {
  logger.info("login started in service");
  const { password, email, username } = body;
  if (!username && !email) {
    throw new AppError(400, "Email Or Username is Required");
  }
  const user = await userService.findOneWithPassword({
    $or: [{ username: username }, { email: email }],
  });

  if (!user) {
    throw new AppError(404, "User does not exist");
  }

  const isPasswordValid = await signToken.decrypted(password, user.password);
  if (!isPasswordValid) {
    throw new AppError(401, "Invalid user credentials");
  }
  const accessToken = signToken.signToken("access", user._id);
  const refreshToken = signToken.signToken("refresh", user._id);

  const loggedInUser = await userService.findOneWithOutPassword({
    $and: [{ _id: user._id }, { email: user.email }],
  });
  const result = await userModel.aggregate([
    {
      $match: { email: loggedInUser.email },
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
            then: { $arrayElemAt: ["$permissions", 0] }, //removing array
            else: null,
          },
        },
      },
    },
    {
      $addFields: {
        permissions: { permissions: "$permissions.permissions" },
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
  const record = {
    accessToken,
    refreshToken,
    tokenType: "Bearer",
    ...result[0],
  };
  return record;
};

// profile
export const getProfile = async (loggedIn) => {
  logger.info("Get Profile In Auth Service");
  const condition = {
    _id: loggedIn,
  };
  const record = await userService.findOneWithOutPassword(condition);
  return record;
};

// refresh user 
export const getUserPermission = async (loggedIn) => {
  logger.info("Get User Permission In Auth Service");
  const condition = {
    _id: loggedIn,
  };
  const record = await userPermissions(condition._id)
  return record;
};
