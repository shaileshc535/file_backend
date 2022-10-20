import express from "express";
import userRoutes from "./userRoute";
import pdfFilesRoute from "./pdfFilesRoute";
import fileSharingRoute from "./fileSharingRoute";
// import googleCloudRoute from "./googleCloudRoute";
// import googleDriveRoutes from "./googleDriveRoutes";

const Router = express.Router();

Router.use("/user", userRoutes);
Router.use("/file", pdfFilesRoute);
Router.use("/files", fileSharingRoute);
// Router.use("/google", googleCloudRoute);
// Router.use("/google-drive", googleDriveRoutes);

export default Router;
