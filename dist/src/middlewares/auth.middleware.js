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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../modal/user"));
function auth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (typeof req.header("Authorization") == "undefined" ||
                req.header("Authorization") == null) {
                throw new Error("Token not found");
            }
            const token = req.header("Authorization").replace("Bearer ", "");
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = yield user_1.default.findOne({
                _id: decoded._id,
            });
            if (!user) {
                return res.status(401).json({
                    status: false,
                    type: "error",
                    message: "User not found",
                });
            }
            req.user = user;
            next();
        }
        catch (error) {
            if (error.message == "invalid signature") {
                return res.status(401).json({
                    status: false,
                    type: "error",
                    message: "Invalid token",
                });
            }
            else {
                if (error.message == "jwt malformed") {
                    return res.status(401).json({
                        status: false,
                        type: "error",
                        message: "Token is not valid",
                    });
                }
                else {
                    return res.status(401).json({
                        status: false,
                        type: "error",
                        message: error.message,
                    });
                }
            }
        }
    });
}
exports.default = auth;
//# sourceMappingURL=auth.middleware.js.map