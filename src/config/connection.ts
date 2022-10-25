// import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import logger from "../logger";
// import logger from "../logger";

const getConnection = async (req, res, next) => {
  if (!process.env.DATABASE_URI) {
    throw new Error("Database URI not found");
  }

  try {
    await mongoose.connect(process.env.DATABASE_URI);
    logger.info("Database Connected to the MongoDB");
    // console.log("Database Connected to the MongoDB");
    next();
  } catch (error) {
    logger.error(error.message);
    return res
      .status(500)
      .json({
        message: "Failed in Database Connection",
        status: false,
        error: error,
      })
      .end();
  }
};

export default getConnection;
