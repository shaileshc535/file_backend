import express from "express";
import Login from "../controller/user/login.controller";
import Register from "../controller/user/register.controller";
import Passwordcontroller from "../controller/user/Password.controller";
import auth from "../middlewares/auth.middleware";

const router = express.Router();

router.use("/register", Register);
router.post("/login", Login);
router.post("/forgotPass", Passwordcontroller.forgotPassword);
router.post("/password-reset/:userId/:token", Passwordcontroller.resetPassword);
router.post("/forgot-reset-password", Passwordcontroller.changeTempPassword);
router.post("/password-change", auth, Passwordcontroller.changePassword);
router.post("/list-users", auth, Passwordcontroller.ListAllUsers);

export default router;
