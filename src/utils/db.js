import mongoose from "mongoose";
import * as logger from "./logs.js";
import config from "../config/index.js";

const openDB = async () => {
  logger.info("Connecting to database");
  let connect;
  try {
    if (mongoose.connection.readyState !== 1) {
      const uri = config.DB_CONNECTION;
      connect = await mongoose.connect(uri);
      logger.info(`Successfully DataBase Connected`);
      return connect;
    }
    return null;
  } catch (error) {
    logger.error(`DataBase Connecting Error For Mongo DataBase`);
    throw new Error(error);
  }
};

export { openDB };
