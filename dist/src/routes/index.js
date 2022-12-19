"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoute_1 = __importDefault(require("./userRoute"));
const pdfFilesRoute_1 = __importDefault(require("./pdfFilesRoute"));
const fileSharingRoute_1 = __importDefault(require("./fileSharingRoute"));
// import googleCloudRoute from "./googleCloudRoute";
// import googleDriveRoutes from "./googleDriveRoutes";
const Router = express_1.default.Router();
Router.use("/user", userRoute_1.default);
Router.use("/file", pdfFilesRoute_1.default);
Router.use("/files", fileSharingRoute_1.default);
// Router.use("/google", googleCloudRoute);
// Router.use("/google-drive", googleDriveRoutes);
exports.default = Router;
//# sourceMappingURL=index.js.map