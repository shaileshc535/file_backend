import express from "express";
import controller from "../controller/pdf/pdfController";
import auth from "../middlewares/auth.middleware";
import multer from "multer";
import { ensureDir } from "fs-extra";

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    await ensureDir("./public/pdf/");
    cb(null, "./public/pdf/");
  },

  filename: function (req, file, cb) {
    const datetimestamp = Date.now();
    cb(null, file.fieldname + "-" + datetimestamp + ".pdf");
  },
});

const upload = multer({
  storage,
  fileFilter: function (req, file, callback) {
    callback(null, true);
  },
}).single("filename");

const router = express.Router();

router.post("/add-file", auth, upload, controller.AddNewPdf);

router.post("/list-files", auth, controller.ListPdfFiles);

router.put("/rename-file", auth, controller.renamePdf);

router.put("/review-file", auth, controller.ReviewPdfFile);

router.put("/delete-file/:fileId", auth, controller.DeletePdfFile);

router.put("/update-file", auth, upload, controller.UpdatePdfFile);

router.get("/get-file/:fileId", auth, controller.GetPdfFileById);

// Routes not used currntly

router.put("/sign-file", auth, upload, controller.UpdateSignedPdfFile);

router.get("/file/:fileId", auth, controller.FileGetById);

router.get(
  "/file-editable-check/:fileId",
  auth,
  controller.CheckPdfFileIsEditable
);

export default router;
