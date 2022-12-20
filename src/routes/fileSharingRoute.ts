import express from "express";
import controller from "../controller/file_sharing/fileSharingController";
import auth from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/share-file", auth, controller.ShareFile);

router.post("/review-files-list", auth, controller.ListReviewedPdfFiles);

router.post("/receive-files-list", auth, controller.ListReceivedFile);

router.post("/signed-files-list", auth, controller.ListSignedPdfFiles);

router.get("/file/:fileId", auth, controller.FilesGetById);

// Routes not Used Currently
router.put("/grand-access/:id", auth, controller.GrandAccess);

router.put("/revoke-access/:id", auth, controller.RevokeAccess);

router.post("/get-file-list", auth, controller.getByFileId);

router.post("/send-files-list", auth, controller.ListSenderFile);

router.post("/review-fail-files", auth, controller.ListReviewedFailPdfFiles);

router.post("/review-pass-files", auth, controller.ListReviewedPassPdfFiles);

router.get("/received-file/:id", auth, controller.ReceivedFileById);

router.get("/send-file/:id", auth, controller.SendFileById);

export default router;
