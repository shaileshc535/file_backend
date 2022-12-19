"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { StatusCodes } from "http-status-codes";
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../logger"));
// import logger from "../logger";
const getConnection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.DATABASE_URI) {
        throw new Error("Database URI not found");
    }
    try {
        yield mongoose_1.default.connect(process.env.DATABASE_URI);
        logger_1.default.info("Database Connected to the MongoDB");
        // console.log("Database Connected to the MongoDB");
        next();
    }
    catch (error) {
        logger_1.default.error(error.message);
        return res
            .status(500)
            .json({
            message: "Failed in Database Connection",
            status: false,
            error: error,
        })
            .end();
    }
});
exports.default = getConnection;
//# sourceMappingURL=connection.js.map