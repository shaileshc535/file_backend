"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fileSharingController_1 = __importDefault(require("../controller/file_sharing/fileSharingController"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = express_1.default.Router();
router.post("/share-file", auth_middleware_1.default, fileSharingController_1.default.ShareFile);
router.post("/get-file-list", auth_middleware_1.default, fileSharingController_1.default.getByFileId);
router.post("/send-files-list", auth_middleware_1.default, fileSharingController_1.default.ListSenderFile);
router.post("/receive-files-list", auth_middleware_1.default, fileSharingController_1.default.ListReceivedFile);
router.put("/grand-access/:id", auth_middleware_1.default, fileSharingController_1.default.GrandAccess);
router.put("/revoke-access/:id", auth_middleware_1.default, fileSharingController_1.default.RevokeAccess);
router.get("/received-file/:id", auth_middleware_1.default, fileSharingController_1.default.ReceivedFileById);
router.get("/send-file/:id", auth_middleware_1.default, fileSharingController_1.default.SendFileById);
exports.default = router;
//# sourceMappingURL=fileSharingRoute.js.map