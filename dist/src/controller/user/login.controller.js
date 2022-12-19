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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../../modal/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const logger_1 = __importDefault(require("../../logger"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const verifiedEmail = email.toLowerCase();
    try {
        user_1.default.findOne({
            email: verifiedEmail,
        }).exec((err, user) => {
            if (err) {
                logger_1.default.error({
                    type: "error",
                    status: 400,
                    message: err,
                });
                res.status(400).send({
                    type: "error",
                    status: 400,
                    message: err,
                });
                return;
            }
            if (!user) {
                logger_1.default.error({
                    type: "error",
                    status: 400,
                    message: "User Not Found",
                });
                return res.status(400).send({
                    type: "error",
                    status: 400,
                    message: "User Not Found",
                });
            }
            const passwordIsValid = bcryptjs_1.default.compareSync(password, user.password);
            if (!passwordIsValid) {
                logger_1.default.error({
                    type: "error",
                    status: 400,
                    message: "Invalid Password!",
                });
                return res.status(400).send({
                    type: "error",
                    status: 400,
                    message: "Invalid Password!",
                });
            }
            const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET, {
            // expiresIn: 86400, //24 hours
            });
            res.status(200).json({
                type: "success",
                status: 200,
                message: "User Successfully Logged-In",
                data: Object.assign(Object.assign({}, user.toObject()), { token: token }),
            });
            // logger.info({
            //   type: "success",
            //   status: 200,
            //   message: "User Successfully Logged-In",
            //   data: {
            //     ...user.toObject(),
            //     token: token,
            //   },
            // });
        });
    }
    catch (error) {
        logger_1.default.error(error.message);
        return res.status(404).json({
            type: "error",
            status: 404,
            message: error.message,
        });
    }
});
exports.default = login;
//# sourceMappingURL=login.controller.js.map