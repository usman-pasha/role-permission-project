import AppError from "../utils/appError.js";
import catchError from "../utils/catchError.js";
import jwt from "jsonwebtoken";
import { userModel } from "../models/user.model.js";
import config from "../config/index.js";

const verifyJWT = async (req, _, next) => {
  try {
    const token = req?.headers?.authorization;
    if (!token) {
      throw new AppError(401, "Authorization header not found");
    }
    // bearer 0 bearer 1 token
    const bearer = token.split(" ")[1];
    const decodedToken = jwt.verify(bearer, config.JWT_SECRET_KEY);
    const userId = decodedToken?.id;
    const condition = {
      _id: userId,
    };
    const projection = {
      _id: true,
      username: true,
      role: true,
    };
    const user = await userModel
      .findOne(condition, projection)
      .select("-password");
    if (!user) {
      throw new AppError(404, "User Not Found");
    }
    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    throw new AppError(401, error?.message || "Invalid access token");
  }
};

export default catchError(verifyJWT);

export const adminAccess = async (req, res, next) => {
  if (req.user.role !== 1) {
    return res.status(401).send({
      message: "You haven't permission to access this routes",
      sucess: false,
    });
  }
  next();
};
