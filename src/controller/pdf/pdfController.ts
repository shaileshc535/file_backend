import PdfSchema from "../../modal/pdf.model";
import SharedFileSchema from "../../modal/sharedFile.model";
import { Response } from "express";
// import StatusCodes from "http-status-codes";
// import fs from "fs";

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

    const user = JSON.parse(JSON.stringify(req.user));

    const { fileId } = req.body;

    const base_url = process.env.BASE_URL;

    const file_url = base_url + "/public/pdf/" + req.file.filename;

    const fileData = await PdfSchema.findOne({
      _id: fileId,
      owner: user._id,
      isdeleted: false,
    }).populate("owner");

    // const file = JSON.parse(JSON.stringify(fileData));

    if (!fileData) {
      return res.status(400).json({
        type: "error",
        status: 400,
        message: "File not found",
      });
    }

    // if (fileData.is_editable !== true) {
    //   return res.status(400).json({
    //     type: "error",
    //     status: 400,
    //     message: `${file.owner.fullname} is already edit this pdf if you want to edit now please contact with ${file.owner.fullname}`,
    //     editable: fileData.is_editable,
    //   });
    // }

    const requestData = {
      file_url: file_url,
      docname: req.body.docname,
      // filename: req.file.filename,
      // filetype: req.file.mimetype,
      filesize: req.file.size,
      // is_editable: false,
      isupdated: true,
      updated_at: Date.now(),
    };

    await PdfSchema.findByIdAndUpdate(
      {
        _id: fileId,
      },
      requestData
    );

    const updatedData = await PdfSchema.findOne({
      _id: fileId,
      owner: user._id,
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

    if (user) {
      cond = { owner: user._id, isdeleted: false, ...cond };
    }

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

    limit = parseInt(limit);

    const result = await PdfSchema.find(cond)
      .populate("owner")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const result_count = await PdfSchema.find(cond).count();
    const totalPages = Math.ceil(result_count / limit);

    return res.status(200).json({
      status: 200,
      type: "success",
      message: "Files Fetch Successfully",
      page: page,
      limit: limit,
      totalPages: totalPages,
      total: result_count,
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

const GetPdfFileById = async (req, res: Response) => {
  try {
    const { fileId } = req.params;
    const user = JSON.parse(JSON.stringify(req.user));

    const result = await PdfSchema.find({
      _id: fileId,
      owner: user._id,
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
  DeletePdfFile,
  ListPdfFiles,
  GetPdfFileById,
  CheckPdfFileIsEditable,
};
