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
/* eslint-disable no-useless-escape */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const email_validator_1 = __importDefault(require("email-validator"));
const user_1 = __importDefault(require("../../modal/user"));
const sendEmail_1 = __importDefault(require("../../services/sendEmail"));
const logger_1 = __importDefault(require("../../logger"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const registerData = req.body;
        if (!registerData.email) {
            logger_1.default.error("Please enter a your email");
            throw new Error("Please enter a your email");
        }
        else {
            if (!email_validator_1.default.validate(registerData.email)) {
                logger_1.default.error("Please enter a valid email");
                throw new Error("Please enter a valid email");
            }
            else {
                const user_count = yield user_1.default.find({ email: registerData.email });
                if (user_count.length != 0) {
                    logger_1.default.error("User already exist");
                    throw new Error("User already exist");
                }
                else {
                    if (user_count.length != 0) {
                        logger_1.default.error("This Email is already assiociate with us");
                        throw new Error("This Email is already assiociate with us");
                    }
                }
            }
        }
        if (!registerData.phone) {
            logger_1.default.error("Please enter your phone number");
            throw new Error("Please enter your phone number");
        }
        else {
            const user_count = yield user_1.default.find({ phone: registerData.phone });
            if (user_count.length != 0) {
                logger_1.default.error("Phone number already in use");
                throw new Error("Phone number already in use");
            }
        }
        const isNonWhiteSpace = /^\S*$/;
        if (!isNonWhiteSpace.test(registerData.password)) {
            logger_1.default.error("Password must not contain Whitespaces.");
            throw new Error("Password must not contain Whitespaces.");
        }
        const isContainsUppercase = /^(?=.*[A-Z]).*$/;
        if (!isContainsUppercase.test(registerData.password)) {
            logger_1.default.error("Password must have at least one Uppercase Character.");
            throw new Error("Password must have at least one Uppercase Character.");
        }
        const isContainsLowercase = /^(?=.*[a-z]).*$/;
        if (!isContainsLowercase.test(registerData.password)) {
            logger_1.default.error("Password must have at least one Lowercase Character.");
            throw new Error("Password must have at least one Lowercase Character.");
        }
        const isContainsNumber = /^(?=.*[0-9]).*$/;
        if (!isContainsNumber.test(registerData.password)) {
            logger_1.default.error("Password must contain at least one Digit.");
            throw new Error("Password must contain at least one Digit.");
        }
        const isContainsSymbol = /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
        if (!isContainsSymbol.test(registerData.password)) {
            logger_1.default.error("Password must contain at least one Special Symbol.");
            throw new Error("Password must contain at least one Special Symbol.");
        }
        const isValidLength = /^.{6,16}$/;
        if (!isValidLength.test(registerData.password)) {
            logger_1.default.error("Password must be 6-16 Characters Long.");
            throw new Error("Password must be 6-16 Characters Long.");
        }
        if (registerData.password != registerData.confirmPassword) {
            logger_1.default.error("Password and confirm Password dosen't match");
            throw new Error("Password and confirm Password dosen't match");
        }
        const user = new user_1.default(Object.assign({}, req.body));
        let data = yield user.save();
        data = JSON.parse(JSON.stringify(data));
        yield (0, sendEmail_1.default)(data.email, "Congratulations Account Created Successfully", "Congratulations your account is created. Please add your professional info and wait for the admin approval.");
        const response = yield user_1.default.findByIdAndUpdate(data._id, { new: true });
        const token = jsonwebtoken_1.default.sign({ _id: data._id }, process.env.JWT_SECRET, {
        // expiresIn: "1d",
        });
        logger_1.default.info({
            status: 200,
            type: "success",
            message: "User Registration Successfully",
            data: Object.assign(Object.assign({}, response.toObject()), { token: token }),
        });
        res.status(200).json({
            status: 200,
            type: "success",
            message: "User Registration Successfully",
            data: Object.assign(Object.assign({}, response.toObject()), { token: token }),
        });
    }
    catch (error) {
        logger_1.default.error(error.message);
        res.status(400).json({
            status: 400,
            type: "error",
            message: error.message,
        });
    }
});
exports.default = register;
//# sourceMappingURL=register.controller.js.map