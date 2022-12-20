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
const express_1 = __importDefault(require("express"));
const pdfController_1 = __importDefault(require("../controller/pdf/pdfController"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const multer_1 = __importDefault(require("multer"));
const fs_extra_1 = require("fs-extra");
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, fs_extra_1.ensureDir)("./public/pdf/");
            cb(null, "./public/pdf/");
        });
    },
    filename: function (req, file, cb) {
        const datetimestamp = Date.now();
        cb(null, file.fieldname + "-" + datetimestamp + ".pdf");
    },
});
const upload = (0, multer_1.default)({
    storage,
    fileFilter: function (req, file, callback) {
        // const ext = path.extname(file.originalname);
        // if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
        //   return callback(new Error("Only images are allowed"));
        // }
        callback(null, true);
    },
}).single("filename");
const router = express_1.default.Router();
router.post("/add-file", auth_middleware_1.default, upload, pdfController_1.default.AddNewPdf);
router.post("/list-files", auth_middleware_1.default, pdfController_1.default.ListPdfFiles);
router.put("/rename-file", auth_middleware_1.default, pdfController_1.default.renamePdf);
router.put("/review-file", auth_middleware_1.default, pdfController_1.default.ReviewPdfFile);
router.put("/delete-file/:fileId", auth_middleware_1.default, pdfController_1.default.DeletePdfFile);
router.put("/update-file", auth_middleware_1.default, upload, pdfController_1.default.UpdatePdfFile);
router.get("/get-file/:fileId", auth_middleware_1.default, pdfController_1.default.GetPdfFileById);
// Routes not used currntly
router.put("/sign-file", auth_middleware_1.default, upload, pdfController_1.default.UpdateSignedPdfFile);
router.get("/file/:fileId", auth_middleware_1.default, pdfController_1.default.FileGetById);
router.get("/file-editable-check/:fileId", auth_middleware_1.default, pdfController_1.default.CheckPdfFileIsEditable);
exports.default = router;
//# sourceMappingURL=pdfFilesRoute.js.map