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
const user_1 = __importDefault(require("../../modal/user"));
const Password_reset_token_1 = __importDefault(require("../../modal/Password-reset-token"));
const sendEmail_1 = __importDefault(require("../../services/sendEmail"));
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const joi_1 = __importDefault(require("joi"));
const logger_1 = __importDefault(require("../../logger"));
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const schema = joi_1.default.object({ email: joi_1.default.string().email().required() });
        const { error } = schema.validate(req.body);
        if (error) {
            logger_1.default.error({
                type: "error",
                status: 400,
                message: error.details[0].message,
            });
            return res.status(400).send({
                type: "error",
                status: 400,
                message: error.details[0].message,
            });
        }
        const user = yield user_1.default.findOne({ email: email });
        if (!user) {
            logger_1.default.error({
                type: "error",
                status: 400,
                message: "user with given email doesn't exist",
            });
            return res.status(400).send({
                type: "error",
                status: 400,
                message: "user with given email doesn't exist",
            });
        }
        let token = yield Password_reset_token_1.default.findOne({ userId: user._id });
        if (!token) {
            token = yield new Password_reset_token_1.default({
                userId: user._id,
                token: crypto_1.default.randomBytes(32).toString("hex"),
            }).save();
        }
        // const link = `${process.env.BASE_URL}/user/password-reset/${user._id}/${token.token}`;
        function generatePassword() {
            let length = 8, charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", retVal = "";
            for (let i = 0, n = charset.length; i < length; ++i) {
                retVal += charset.charAt(Math.floor(Math.random() * n));
            }
            return retVal + "@";
        }
        const tempPass = generatePassword();
        user.password = tempPass;
        yield user.save({ validateBeforeSave: false });
        // await token.delete();
        yield (0, sendEmail_1.default)(user.email, "Here is your temprory created Password", tempPass);
        logger_1.default.info({
            type: "success",
            status: 200,
            message: "Temp Password",
            Password_Reset_Link: tempPass,
        });
        res.status(200).json({
            type: "success",
            status: 200,
            message: "Temp Password",
            Password_Reset_Link: tempPass,
        });
    }
    catch (err) {
        logger_1.default.error(err.message);
        res.status(404).json({
            type: "error",
            status: 404,
            message: "An Error Occured Please Try After Some Time!",
        });
    }
});
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
    const pass_rgex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    try {
        const { password, confirmPassword } = req.body;
        const schema = joi_1.default.object({
            password: joi_1.default.string().required(),
            confirmPassword: joi_1.default.string().required(),
        });
        const { error } = schema.validate(req.body);
        if (error)
            logger_1.default.error({
                type: "error",
                status: 400,
                message: error.details[0].message,
            });
        return res.status(400).send({
            type: "error",
            status: 400,
            message: error.details[0].message,
        });
        const user = yield user_1.default.findById(req.params.userId);
        if (!user)
            logger_1.default.error({
                type: "error",
                status: 400,
                message: "Invalid Link or expired",
            });
        return res.status(400).send({
            type: "error",
            status: 400,
            message: "Invalid Link or expired",
        });
        const token = yield Password_reset_token_1.default.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token)
            logger_1.default.error({
                type: "error",
                status: 400,
                message: "Invalid Link or expired",
            });
        return res.status(400).send({
            type: "error",
            status: 400,
            message: "Invalid Link or expired",
        });
        if (!pass_rgex.test(password)) {
            logger_1.default.error({
                type: "error",
                status: 400,
                message: "Password must have minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character",
            });
            return res.status(400).json({
                type: "error",
                status: 400,
                message: "Password must have minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character",
            });
        }
        if (password !== confirmPassword) {
            logger_1.default.error({
                type: "error",
                status: 400,
                message: "Password didn't Match",
            });
            return res.status(400).json({
                type: "error",
                status: 400,
                message: "Password didn't Match",
            });
        }
        user.password = password;
        yield user.save({ validateBeforeSave: false });
        yield token.delete();
        logger_1.default.info({
            type: "success",
            status: 200,
            message: "Password Changed!",
        });
        return res.status(200).json({
            type: "success",
            status: 200,
            message: "Password Changed!",
        });
    }
    catch (err) {
        logger_1.default.error(err.message);
        return res.status(404).json({
            type: "error",
            status: 404,
            message: "An Error Occured!",
        });
    }
});
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
    const pass_rgex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    try {
        const { currentPassword, newPassword, confirmNewPassword } = req.body;
        const user = req.user;
        const schema = joi_1.default.object({
            currentPassword: joi_1.default.string().required(),
            newPassword: joi_1.default.string().required(),
            confirmNewPassword: joi_1.default.string().required(),
        });
        const { error } = schema.validate(req.body);
        if (error) {
            logger_1.default.error({
                type: "error",
                status: 400,
                message: error.details[0].message,
            });
            return res.status(400).send({
                type: "error",
                status: 400,
                message: error.details[0].message,
            });
        }
        const passwordIsValid = bcryptjs_1.default.compareSync(currentPassword, user.password);
        if (!passwordIsValid) {
            logger_1.default.error({
                type: "error",
                status: 400,
                message: "Invalid Current Password!",
            });
            return res.status(400).send({
                type: "error",
                status: 400,
                message: "Invalid Current Password!",
            });
        }
        if (!pass_rgex.test(newPassword)) {
            logger_1.default.error({
                type: "error",
                status: 400,
                message: "Password must have minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character",
            });
            return res.status(400).json({
                type: "error",
                status: 400,
                message: "Password must have minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character",
            });
        }
        if (newPassword !== confirmNewPassword) {
            logger_1.default.error({
                type: "error",
                status: 400,
                message: "New Password and Confirm Password Is not same",
            });
            return res.status(400).json({
                type: "error",
                status: 400,
                message: "New Password and Confirm Password Is not same",
            });
        }
        user.password = newPassword;
        yield user.save({ validateBeforeSave: false });
        logger_1.default.info({
            type: "success",
            status: 200,
            message: "Password changed successful",
            data: user,
        });
        return res.status(200).json({
            type: "success",
            status: 200,
            message: "Password changed successful",
            data: user,
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
const changeTempPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pass_rgex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    try {
        const { email, tmp_password, new_password, confirm_password } = req.body;
        const schema = joi_1.default.object({ email: joi_1.default.string().email().required() });
        const user = yield user_1.default.findOne({ email: email });
        if (!user) {
            logger_1.default.error({
                type: "error",
                status: 400,
                message: "user with given email doesn't exist",
            });
            return res.status(400).send({
                type: "error",
                status: 400,
                message: "user with given email doesn't exist",
            });
        }
        const passwordIsValid = bcryptjs_1.default.compareSync(tmp_password, user.password);
        if (!passwordIsValid) {
            logger_1.default.error({
                type: "error",
                status: 400,
                message: "Invalid Current Password!",
            });
            return res.status(400).send({
                type: "error",
                status: 400,
                message: "Invalid Current Password!",
            });
        }
        if (!pass_rgex.test(new_password)) {
            logger_1.default.error({
                type: "error",
                status: 400,
                message: "Password must have minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character",
            });
            return res.status(400).json({
                type: "error",
                status: 400,
                message: "Password must have minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character",
            });
        }
        if (new_password !== confirm_password) {
            logger_1.default.error({
                type: "error",
                status: 400,
                message: "New Password and Confirm Password Is not same",
            });
            return res.status(400).json({
                type: "error",
                status: 400,
                message: "New Password and Confirm Password Is not same",
            });
        }
        user.password = new_password;
        yield user.save({ validateBeforeSave: false });
        logger_1.default.info({
            type: "success",
            status: 200,
            message: "Password changed successful",
            data: user,
        });
        return res.status(200).json({
            type: "success",
            status: 200,
            message: "Password changed successful",
            data: user,
        });
    }
    catch (err) {
        logger_1.default.error(err.message);
        return res.status(404).json({
            type: "error",
            status: 404,
            message: err.message,
        });
    }
});
const ListAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = JSON.parse(JSON.stringify(req.user));
        let { page, limit, sort, cond } = req.body;
        if (user) {
            cond = Object.assign({}, cond);
        }
        if (!page || page < 1) {
            page = 1;
        }
        if (!limit) {
            limit = 10;
        }
        if (!cond) {
            cond = {};
        }
        if (!sort) {
            sort = { createdAt: -1 };
        }
        limit = parseInt(limit);
        const result = yield user_1.default.find(cond)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);
        const result_count = yield user_1.default.find(cond).count();
        const totalPages = Math.ceil(result_count / limit);
        logger_1.default.info({
            status: 200,
            type: "success",
            message: "Users Fetch Successfully",
            page: page,
            limit: limit,
            totalPages: totalPages,
            total: result_count,
            data: result,
        });
        return res.status(200).json({
            status: 200,
            type: "success",
            message: "Users Fetch Successfully",
            page: page,
            limit: limit,
            totalPages: totalPages,
            total: result_count,
            data: result,
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
exports.default = {
    forgotPassword,
    resetPassword,
    changePassword,
    changeTempPassword,
    ListAllUsers,
};
//# sourceMappingURL=Password.controller.js.map