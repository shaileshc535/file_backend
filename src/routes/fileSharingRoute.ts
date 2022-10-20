import express from "express";
import controller from "../controller/file_sharing/fileSharingController";
import auth from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/share-file", auth, controller.ShareFile);
router.post("/get-file-list", auth, controller.getByFileId);
router.post("/send-files-list", auth, controller.ListSenderFile);
router.post("/receive-files-list", auth, controller.ListReceivedFile);
router.put("/grand-access/:id", auth, controller.GrandAccess);
router.put("/revoke-access/:id", auth, controller.RevokeAccess);
router.get("/received-file/:id", auth, controller.ReceivedFileById);
router.get("/send-file/:id", auth, controller.SendFileById);

export default router;
