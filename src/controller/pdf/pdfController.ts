/* eslint-disable @typescript-eslint/no-explicit-any */
import PdfSchema from "../../modal/pdf.model";
import SharedFileSchema from "../../modal/sharedFile.model";
import { Response } from "express";
import mongoose from "mongoose";

const ObjectId = <any>mongoose.Types.ObjectId;

export interface IPdf {
  owner: string;
  filename: string;
  filetype?: string;
  filesize?: string;
  docname?: string;
  isdeleted: boolean;
  is_editable: boolean;
  isupdated: boolean;
  deleted_at?: Date;
  updated_at?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const AddNewPdf = async (req, res: Response) => {
  try {
    const user = JSON.parse(JSON.stringify(req.user));

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a file",
      });
    }

    const base_url = process.env.BASE_URL;

    const file_url = base_url + "/public/pdf/" + req.file.filename;

    const newFile = new PdfSchema({
      owner: user._id,
      docname: req.body.docname,
      filename: req.file.filename,
      file_url: file_url,
      filetype: req.file.mimetype,
      filesize: req.file.size,
    });

    await newFile.save();

    res.status(200).json({
      type: "success",
      status: 200,
      message: "File Uploaded successfully",
      data: newFile,
    });
  } catch (error) {
    return res.status(404).json({
      type: "error",
      status: 404,
      message: error.message,
    });
  }
};

const UpdatePdfFile = async (req, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        type: "error",
        status: 400,
        message: "Please upload a file First",
      });
    }

    const { fileId } = req.body;

    const base_url = process.env.BASE_URL;

    const file_url = base_url + "/public/pdf/" + req.file.filename;

    const fileData = await PdfSchema.findOne({
      _id: fileId,
      isdeleted: false,
    }).populate("owner");

    if (!fileData) {
      return res.status(400).json({
        type: "error",
        status: 400,
        message: "File not found",
      });
    }

    // console.log("fileData", fileData.docname);

    const getFirstPart = (str) => {
      return str.split(".")[0];
    };

    const getSecondPart = (str) => {
      return str.split(".")[1];
    };

    const firstChar = getFirstPart(fileData.docname);
    const secoundChar = getSecondPart(fileData.docname);

    const finalVal = firstChar + "_signed" + "." + secoundChar;

    const requestData = {
      file_url: file_url,
      docname: finalVal,
      filesize: req.file.size,
      isupdated: true,
      updated_at: Date.now(),
      is_signed: true,
      is_editable: false,
    };

    await PdfSchema.findByIdAndUpdate(
      {
        _id: fileId,
      },
      requestData
    );

    const updatedData = await PdfSchema.findOne({
      _id: fileId,
      isdeleted: false,
    });

    res.status(200).json({
      type: "success",
      status: 200,
      message: "File Uploaded successfully",
      data: updatedData,
    });
  } catch (error) {
    return res.status(404).json({
      type: "error",
      status: 404,
      message: error.message,
    });
  }
};

const ReviewPdfFile = async (req, res: Response) => {
  try {
    const id = req.body.fileId;

    const user = JSON.parse(JSON.stringify(req.user));

    const fileData = await PdfSchema.findOne({
      _id: id,
      isdeleted: false,
    }).populate("owner");

    if (!fileData) {
      return res.status(400).json({
        type: "error",
        status: 400,
        message: "File not found",
      });
    }

    const file = JSON.parse(JSON.stringify(fileData));

    if (file.is_shared !== true) {
      return res.status(400).json({
        type: "error",
        status: 400,
        message: `This file is not a shared file. Please contact ${file.owner.fullname} for permission`,
        data: "",
      });
    }

    if (file.is_signed !== true) {
      return res.status(400).json({
        type: "error",
        status: 400,
        message: `this file is not signed. Please contact ${file.owner.fullname} for permission`,
        data: "",
      });
    }

    const requestData = {
      is_reviewd: true,
      is_passed: true,
      review_date: Date.now(),
      pass_date: Date.now(),
    };

    await PdfSchema.findByIdAndUpdate(
      {
        _id: id,
      },
      requestData
    );

    const updatedData = await PdfSchema.findOne({
      _id: id,
    });

    res.status(200).json({
      type: "success",
      status: 200,
      message: "file review & passed successfully.",
      data: updatedData,
    });
  } catch (error) {
    return res.status(404).json({
      type: "error",
      status: 404,
      message: error.message,
    });
  }
};

const ReviewFail = async (req, res: Response) => {
  try {
    const id = req.body.fileId;

    const fileData = await PdfSchema.findOne({
      _id: id,
      isdeleted: false,
    }).populate("owner");

    if (!fileData) {
      return res.status(400).json({
        type: "error",
        status: 400,
        message: "File not found",
      });
    }

    const file = JSON.parse(JSON.stringify(fileData));

    if (file.is_shared !== true) {
      return res.status(400).json({
        type: "error",
        status: 400,
        message: `This file is not a shared file. Please contact ${file.owner.fullname} for permission`,
        data: "",
      });
    }

    if (file.is_signed !== true) {
      return res.status(400).json({
        type: "error",
        status: 400,
        message: `this file is not signed. Please contact ${file.owner.fullname} for permission`,
        data: "",
      });
    }

    const requestData = {
      is_reviewd: true,
      is_passed: false,
      review_fail_reason: req.body.fail_reason,
      review_date: Date.now(),
      fail_date: Date.now(),
    };

    await PdfSchema.findByIdAndUpdate(
      {
        _id: id,
      },
      requestData
    );

    const updatedData = await PdfSchema.findOne({
      _id: id,
    });

    res.status(200).json({
      type: "success",
      status: 200,
      message: "file review failed.",
      data: updatedData,
    });
  } catch (error) {
    return res.status(404).json({
      type: "error",
      status: 404,
      message: error.message,
    });
  }
};

const DeletePdfFile = async (req, res: Response) => {
  try {
    const id = req.params.fileId;

    const user = JSON.parse(JSON.stringify(req.user));

    const fileData = await PdfSchema.findOne({
      _id: id,
      isdeleted: false,
    }).populate("owner");

    const file = JSON.parse(JSON.stringify(fileData));

    if (file.owner._id !== user._id) {
      return res.status(400).json({
        type: "error",
        status: 400,
        message: `you don’t have permission to delete this file. Please contact ${file.owner.fullname} for permission`,
      });
    }

    if (!fileData) {
      return res.status(400).json({
        type: "error",
        status: 400,
        message: "File not found",
      });
    }

    const requestData = {
      isdeleted: true,
      deleted_at: Date.now(),
    };

    await PdfSchema.findByIdAndUpdate(
      {
        _id: id,
      },
      requestData
    );

    await SharedFileSchema.findOneAndUpdate(
      {
        fileId: id,
      },
      requestData
    );

    res.status(200).json({
      type: "success",
      status: 200,
      message: "File Deleted successfully",
      data: "",
    });
  } catch (error) {
    return res.status(404).json({
      type: "error",
      status: 404,
      message: error.message,
    });
  }
};

const ListPdfFiles = async (req, res: Response) => {
  try {
    const user = JSON.parse(JSON.stringify(req.user));
    let { page, limit, sort, cond } = req.body;

    let search = "";

    if (!page || page < 1) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }
    if (!cond) {
      cond = {};
    }
    if (!sort) {
      sort = { createdAt: -1 };
    }
    if (typeof cond.search != "undefined" && cond.search != null) {
      search = String(cond.search);
      delete cond.search;
    }

    cond = [
      {
        $match: {
          isdeleted: false,
          owner: ObjectId(user._id),
          $and: [
            cond,
            {
              $or: [
                { docname: { $regex: search, $options: "i" } },
                { filename: { $regex: search, $options: "i" } },
              ],
            },
          ],
        },
      },
      { $sort: sort },
      {
        $facet: {
          data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
          total: [
            {
              $count: "count",
            },
          ],
        },
      },
    ];

    limit = parseInt(limit);

    // const result = await PdfSchema.find(cond)
    //   .populate("owner")
    //   .sort(sort)
    //   .skip((page - 1) * limit)
    //   .limit(limit);

    const result = await PdfSchema.aggregate(cond);

    let totalPages = 0;
    if (result[0].total.length != 0) {
      totalPages = Math.ceil(result[0].total[0].count / limit);
    }

    // const result_count = await PdfSchema.find(cond).count();
    // const totalPages = Math.ceil(result_count / limit);

    return res.status(200).json({
      status: 200,
      type: "success",
      message: "Files Fetch Successfully",
      page: page,
      limit: limit,
      totalPages: totalPages,
      total: result[0].total.length != 0 ? result[0].total[0].count : 0,
      data: result[0].data,
    });
  } catch (error) {
    return res.status(404).json({
      type: "error",
      status: 404,
      message: error.message,
    });
  }
};

const GetPdfFileById = async (req, res: Response) => {
  try {
    const { fileId } = req.params;

    const result = await PdfSchema.find({
      _id: fileId,
      isdeleted: false,
    }).populate("owner");

    return res.status(200).json({
      status: 200,
      type: "success",
      message: "File Fetched Successfully",
      data: result,
    });
  } catch (error) {
    return res.status(404).json({
      type: "error",
      status: 404,
      message: error.message,
    });
  }
};

const FileGetById = async (req, res: Response) => {
  try {
    const { fileId } = req.params;

    const result = await PdfSchema.find({
      _id: fileId,
      isdeleted: false,
    }).populate("owner");

    return res.status(200).json({
      status: 200,
      type: "success",
      message: "File Fetched Successfully",
      data: result,
    });
  } catch (error) {
    return res.status(404).json({
      type: "error",
      status: 404,
      message: error.message,
    });
  }
};

const CheckPdfFileIsEditable = async (req, res: Response) => {
  try {
    const { fileId } = req.params;

    const result = await PdfSchema.findById({
      _id: fileId,
    }).populate("owner");

    const file = JSON.parse(JSON.stringify(result));

    if (result.is_editable !== true) {
      return res.status(400).json({
        status: 400,
        type: "error",
        message: `${file.owner.fullname} is already edit this pdf if you want to edit now please contact with ${file.owner.fullname}`,
        editable: result.is_editable,
        // data: result,
      });
    }
    return res.status(200).json({
      status: 200,
      type: "success",
      message: "File is Editable",
      editable: result.is_editable,
      // data: result,
    });
  } catch (error) {
    return res.status(404).json({
      type: "error",
      status: 404,
      message: error.message,
    });
  }
};

export default {
  AddNewPdf,
  UpdatePdfFile,
  ReviewPdfFile,
  ReviewFail,
  DeletePdfFile,
  ListPdfFiles,
  GetPdfFileById,
  CheckPdfFileIsEditable,
  FileGetById,
};
