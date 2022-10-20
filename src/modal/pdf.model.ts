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
}

const pdfSchema = new Schema<IPdf>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "user", required: true },
    filename: { type: String, required: true },
    file_url: { type: String, required: true },
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
