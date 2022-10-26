import express from "express";
import userRoutes from "./userRoute";
import pdfFilesRoute from "./pdfFilesRoute";
import fileSharingRoute from "./fileSharingRoute";

const Router = express.Router();

Router.use("/user", userRoutes);
Router.use("/file", pdfFilesRoute);
Router.use("/files", fileSharingRoute);

export default Router;
