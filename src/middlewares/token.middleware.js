import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config/index.js";

export const signToken = (type, id) => {
  let secratKey;
  let validity;
  switch (type) {
    case "access":
      secratKey = config.JWT_SECRET_KEY;
      validity = config.JWT_VALIDITY;
      break;
    case "refresh":
      secratKey = config.JWT_REFRESH_SECRET_KEY;
      validity = config.JWT_REFRESH_VALIDITY;
      break;
    default:
      throw new Error("Invalid Token!");
  }
  return jwt.sign({ id }, secratKey, { expiresIn: validity });
};

export const encrypted = async (data) => {
  return bcrypt.hashSync(data, 10);
};

export const decrypted = async (data, hash) => {
  return bcrypt.compare(data, hash);
};
