import { Schema, model, PopulatedDoc } from "mongoose";
import { IUser } from "./user";

export interface IPdf {
  owner?: PopulatedDoc<IUser>;
  filename: string;
  filetype?: string;
  filesize?: string;
  file_url?: string;
  docname?: string;
  isdeleted: boolean;
  is_editable: boolean;
  isupdated: boolean;
  deleted_at: Date;
  updated_at: Date;
  fileConsumers: Array<string>;
  is_shared: boolean;
  is_signed: boolean;
  is_reviewd: boolean;
  is_passed: boolean;
  review_date: Date;
  pass_date: Date;
  fail_date: Date;
  review_fail_reason: string;
  sign_stamp: string;
}

const pdfSchema = new Schema<IPdf>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "user", required: true },
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
        type: Schema.Types.ObjectId,
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
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

pdfSchema.virtual("uploader", {
  ref: "user",
  localField: "owner",
  foreignField: "_id",
  justOne: true,
});

const PdfSchema = model("PdfSchema", pdfSchema);

export default PdfSchema;
