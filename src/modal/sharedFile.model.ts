import mongoose, { Schema, model, PopulatedDoc } from "mongoose";
import { IUser } from "./user";
import { IPdf } from "./pdf.model";

export interface ISHAREDFILE {
  receiverId?: PopulatedDoc<IUser>;
  senderId?: PopulatedDoc<IUser>;
  fileId?: PopulatedDoc<IPdf>;
  access: boolean;
  IsSigned: boolean;
  isdeleted: boolean;
  file_is_open: boolean;
  deleted_at: Date;
  file_open_at: Date;
  comment: string;
}

const fileShareSchema = new mongoose.Schema<ISHAREDFILE>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    fileId: {
      type: Schema.Types.ObjectId,
      ref: "PdfSchema",
      default: null,
    },
    comment: { type: String },
    access: { type: Boolean, default: true },
    IsSigned: { type: Boolean, default: true },
    file_is_open: { type: Boolean, default: false },
    isdeleted: { type: Boolean, default: false },
    file_open_at: { type: Date, default: null },
    deleted_at: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

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

const file_share = model("file_share", fileShareSchema);

export default file_share;
