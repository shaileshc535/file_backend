"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const login_controller_1 = __importDefault(require("../controller/user/login.controller"));
const register_controller_1 = __importDefault(require("../controller/user/register.controller"));
const Password_controller_1 = __importDefault(require("../controller/user/Password.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = express_1.default.Router();
router.use("/register", register_controller_1.default);
router.post("/login", login_controller_1.default);
router.post("/forgotPass", Password_controller_1.default.forgotPassword);
router.post("/password-reset/:userId/:token", Password_controller_1.default.resetPassword);
router.post("/forgot-reset-password", Password_controller_1.default.changeTempPassword);
router.post("/password-change", auth_middleware_1.default, Password_controller_1.default.changePassword);
router.post("/list-users", auth_middleware_1.default, Password_controller_1.default.ListAllUsers);
exports.default = router;
//# sourceMappingURL=userRoute.js.map