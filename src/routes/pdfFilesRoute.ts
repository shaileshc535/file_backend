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
    // const ext = path.extname(file.originalname);
    // if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
    //   return callback(new Error("Only images are allowed"));
    // }
    callback(null, true);
  },
}).single("filename");

const router = express.Router();

router.post("/add-file", auth, upload, controller.AddNewPdf);
router.put("/update-file", auth, upload, controller.UpdatePdfFile);
router.put("/delete-file/:fileId", auth, controller.DeletePdfFile);
router.post("/list-files", auth, controller.ListPdfFiles);
router.get("/get-file/:fileId", auth, controller.GetPdfFileById);
router.get(
  "/file-editable-check/:fileId",
  auth,
  controller.CheckPdfFileIsEditable
);

export default router;
