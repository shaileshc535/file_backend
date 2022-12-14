"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const fileShareSchema = new mongoose_1.default.Schema({
    senderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "user", required: true },
    receiverId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
        default: null,
    },
    fileId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "PdfSchema",
        default: null,
    },
    comment: { type: String },
    access: { type: Boolean, default: true },
    file_is_open: { type: Boolean, default: false },
    isdeleted: { type: Boolean, default: false },
    file_open_at: { type: Date, default: null },
    deleted_at: { type: Date, default: null },
    IsSigned: { type: Boolean, default: false },
    isReviewd: { type: Boolean, default: false },
    isPassed: { type: Boolean, default: false },
    signTime: { type: Date },
    reviewTime: { type: Date },
    reviewPassTime: { type: Date },
    reviewFailTime: { type: Date },
    reviewFailReason: { type: String },
}, {
    timestamps: true,
});
fileShareSchema.virtual("sender", {
    ref: "user",
    localField: "senderId",
    foreignField: "_id",
    justOne: true,
});
fileShareSchema.virtual("receiver", {
    ref: "user",
    localField: "receiverId",
    foreignField: "_id",
    justOne: true,
});
fileShareSchema.virtual("file", {
    ref: "PdfSchema",
    localField: "fileId",
    foreignField: "_id",
    justOne: true,
});
const file_share = (0, mongoose_1.model)("file_share", fileShareSchema);
exports.default = file_share;
//# sourceMappingURL=sharedFile.model.js.map