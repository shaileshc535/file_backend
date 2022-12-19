"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const pdfSchema = new mongoose_1.Schema({
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: "user", required: true },
    filename: { type: String, required: true },
    file_url: { type: String, required: true },
    sign_stamp: { type: String },
    docname: { type: String },
    filetype: { type: String },
    filesize: { type: String },
    is_editable: { type: Boolean, default: true },
    isupdated: { type: Boolean, default: false },
    isdeleted: { type: Boolean, default: false },
    deleted_at: { type: Date },
    updated_at: { type: Date },
    fileConsumers: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "user",
            default: null,
        },
    ],
    is_shared: { type: Boolean, default: false },
    is_signed: { type: Boolean, default: false },
    is_reviewd: { type: Boolean, default: false },
    is_passed: { type: Boolean, default: false },
    review_date: { type: Date },
    pass_date: { type: Date },
    fail_date: { type: Date },
    review_fail_reason: { type: String },
}, { timestamps: true, toJSON: { virtuals: true } });
pdfSchema.virtual("uploader", {
    ref: "user",
    localField: "owner",
    foreignField: "_id",
    justOne: true,
});
const PdfSchema = (0, mongoose_1.model)("PdfSchema", pdfSchema);
exports.default = PdfSchema;
//# sourceMappingURL=pdf.model.js.map