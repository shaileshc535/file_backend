/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express";
import mongoose from "mongoose";
import PdfSchema from "../../modal/pdf.model";
import SharedFileSchema from "../../modal/sharedFile.model";
import logger from "../../logger";
import fs from "fs";
import { createCanvas, loadImage } from "canvas";
import moment from "moment";

const ObjectId = <any>mongoose.Types.ObjectId;

export interface IPdf {
  owner: string;
  filename: string;
  filetype?: string;
  filesize?: string;
  docname?: string;
  sign_stamp?: string;
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
      // logger.error("Please upload a file");

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

    // logger.info("File Uploaded successfully");

    res.status(200).json({
      type: "success",
      status: 200,
      message: "File Uploaded successfully",
      data: newFile,
    });
  } catch (error) {
    // logger.error(error.message);
    return res.status(404).json({
      type: "error",
      status: 404,
      message: error.message,
    });
  }
};

const UpdatePdfFile = async (req, res: Response) => {
  // try {
  const { fileId } = req.body;

  const user = JSON.parse(JSON.stringify(req.user));

  const Time = Date.now();

  const imageString = user._id + " : " + moment(Time).format("llll");
  const imageName = user._id + Time;

  const width = 800;
  const height = 300;

  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  context.fillStyle = "#fff";
  context.fillRect(0, 0, width, height);

  context.font = "bold 70pt";
  context.textAlign = "center";
  context.textBaseline = "top";
  context.fillStyle = "#000";

  context.font = "20pt 'PT Sans'";
  context.fillText(imageString, 400, 200);

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(`./public/buffer/./${imageName}.png`, buffer);

  const base_url = process.env.BASE_URL;

  const stamp_url = base_url + "/public/buffer/" + imageName + ".png";

  const file_url = base_url + "/public/pdf/" + req.file.filename;

  console.log("stamp_url", stamp_url);

  const fileData = await PdfSchema.findOne({
    _id: fileId,
    isdeleted: false,
  }).populate("owner");

  if (!fileData) {
    logger.error("File not found");

    return res.status(400).json({
      type: "error",
      status: 400,
      message: "File not found",
    });
  }

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
    // sign_stamp: stamp_url,
    filesize: req.file.size,
    isupdated: true,
    updated_at: Date.now(),
    is_signed: true,
    is_editable: true,
  };

  await PdfSchema.findByIdAndUpdate(
    {
      _id: fileId,
    },
    requestData
  );

  // const reqData = {
  //   IsSigned: true,
  //   signTime: Date.now(),
  // };

  // await SharedFileSchema.findByIdAndUpdate(
  //   {
  //     _id: req.body.docFileId,
  //   },
  //   reqData
  // );

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
  // } catch (error) {
  //   // logger.error(error.message);
  //   return res.status(404).json({
  //     type: "error",
  //     status: 404,
  //     message: error.message,
  //   });
  // }
};

const UpdateSignedPdfFile = async (req, res: Response) => {
  try {
    const user = JSON.parse(JSON.stringify(req.user));

    const Time = Date.now();

    const imageString = user._id + " : " + moment(Time).format("llll");
    const imageName = user._id + Time;

    const width = 800;
    const height = 300;

    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    context.fillStyle = "#fff";
    context.fillRect(0, 0, width, height);

    context.font = "bold 70pt";
    context.textAlign = "center";
    context.textBaseline = "top";
    context.fillStyle = "#000";

    context.font = "20pt 'PT Sans'";
    context.fillText(imageString, 400, 200);

    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(`./public/buffer/./${imageName}.png`, buffer);

    const { fileId } = req.body;

    const base_url = process.env.BASE_URL;

    const file_url = base_url + "/public/pdf/" + req.file.filename;
    const stamp_url = base_url + "/public/buffer/" + imageName + ".png";

    console.log("stamp_url", stamp_url);

    const fileData = await PdfSchema.findOne({
      _id: fileId,
      isdeleted: false,
    }).populate("owner");

    if (!fileData) {
      logger.error("File not found");

      return res.status(400).json({
        type: "error",
        status: 400,
        message: "File not found",
      });
    }

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
      sign_stamp: stamp_url,
      filesize: req.file.size,
      isupdated: true,
      updated_at: Date.now(),
      is_signed: true,
      is_editable: true,
    };

    await PdfSchema.findByIdAndUpdate(
      {
        _id: fileId,
      },
      requestData
    );

    // const reqData = {
    //   IsSigned: true,
    //   signTime: Date.now(),
    // };

    // await SharedFileSchema.findByIdAndUpdate(
    //   {
    //     _id: req.body.docFileId,
    //   },
    //   reqData
    // );

    const updatedData = await PdfSchema.findOne({
      _id: fileId,
      isdeleted: false,
    });

    logger.info({
      type: "success",
      status: 200,
      message: "File Uploaded successfully",
      data: updatedData,
    });

    res.status(200).json({
      type: "success",
      status: 200,
      message: "File Uploaded successfully",
      data: updatedData,
    });
  } catch (error) {
    logger.error(error.message);

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
    const { isReviewd, fail_reason } = req.body;

    const user = JSON.parse(JSON.stringify(req.user));

    if (isReviewd == undefined) {
      return res.status(400).json({
        type: "error",
        status: 400,
        message: "File review is required.",
      });
    }

    const fileData = await SharedFileSchema.findOne({
      _id: id,
      isdeleted: false,
    })
      .populate("senderId")
      .populate("receiverId")
      .populate("fileId");

    if (!fileData) {
      return res.status(400).json({
        type: "error",
        status: 400,
        message: "File not found",
      });
    }

    const file = JSON.parse(JSON.stringify(fileData));

    if (file.senderId._id !== user._id) {
      // logger.error(
      //   `You are not authorised to review thid file. Please contact ${file.senderId.fullname} for permission`
      // );

      return res.status(400).json({
        type: "error",
        status: 400,
        message: `You are not authorised to review thid file. Please contact ${file.senderId.fullname} for permission`,
        data: "",
      });
    }

    let requestData = {};
    let fileDataVal = {};

    const getFirstPart = (str) => {
      return str.split("_")[0];
    };

    const getSecondPart = (str) => {
      return str.split(".")[1];
    };

    const firstChar = getFirstPart(file.fileId.docname);
    const secoundChar = getSecondPart(file.fileId.docname);

    if (isReviewd == true) {
      const finalVal = firstChar + "_passed" + "." + secoundChar;

      fileDataVal = {
        docname: finalVal,
        is_shared: true,
        is_signed: true,
        is_reviewd: true,
        is_passed: true,
      };

      requestData = {
        isReviewd: true,
        isPassed: true,
        reviewTime: Date.now(),
        reviewPassTime: Date.now(),
      };
    } else if (isReviewd == false) {
      const finalVal = firstChar + "_failed" + "." + secoundChar;

      fileDataVal = {
        docname: finalVal,
        is_shared: true,
        is_signed: true,
        is_reviewd: true,
        is_passed: false,
      };

      requestData = {
        isReviewd: true,
        isPassed: false,
        reviewFailReason: fail_reason,
        reviewTime: Date.now(),
        reviewFailTime: Date.now(),
      };
    }

    await SharedFileSchema.findByIdAndUpdate(
      {
        _id: id,
      },
      requestData
    );

    await PdfSchema.findByIdAndUpdate(
      {
        _id: file.fileId._id,
      },
      fileDataVal
    );

    const updatedData = await SharedFileSchema.findOne({
      _id: id,
    })
      .populate("senderId")
      .populate("receiverId")
      .populate("fileId");

    // logger.info({
    //   type: "success",
    //   status: 200,
    //   message: "file review & passed successfully.",
    //   data: updatedData,
    // });

    res.status(200).json({
      type: "success",
      status: 200,
      message: "file review & passed successfully.",
      data: updatedData,
    });
  } catch (error) {
    // logger.error(error.message);

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
      // logger.error(
      //   `you don’t have permission to delete this file. Please contact ${file.owner.fullname} for permission`
      // );
      return res.status(400).json({
        type: "error",
        status: 400,
        message: `you don’t have permission to delete this file. Please contact ${file.owner.fullname} for permission`,
      });
    }

    if (!fileData) {
      // logger.error(`File not found`);
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

    // logger.error("File Deleted Successfully");

    res.status(200).json({
      type: "success",
      status: 200,
      message: "File Deleted successfully",
      data: "",
    });
  } catch (error) {
    // logger.error(error.message);

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
    let { page, limit, sort, cond, paginate } = req.body;

    let search = "";

    if (paginate == undefined) {
      paginate = true;
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

    const result = await PdfSchema.aggregate(cond);

    if (paginate !== false) {
      let totalPages = 0;
      if (result[0].total.length != 0) {
        totalPages = Math.ceil(result[0].total[0].count / limit);
      }

      // logger.info({
      //   status: 200,
      //   type: "success",
      //   message: "Files Fetch Successfully",
      //   page: page,
      //   limit: limit,
      //   totalPages: totalPages,
      //   total: result[0].total.length != 0 ? result[0].total[0].count : 0,
      //   data: result[0].data,
      // });

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
    } else if (paginate !== true) {
      // logger.info({
      //   status: 200,
      //   type: "success",
      //   message: "Files Fetch Successfully",
      //   data: result[0].data,
      // });

      return res.status(200).json({
        status: 200,
        type: "success",
        message: "Files Fetch Successfully",
        data: result[0].data,
      });
    }
  } catch (error) {
    // logger.error(error.message);
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

    // logger.error("File Fetched Successfully");

    return res.status(200).json({
      status: 200,
      type: "success",
      message: "File Fetched Successfully",
      data: result,
    });
  } catch (error) {
    // logger.error(error.message);

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

    // logger.error(`File Fetched Successfully`);

    return res.status(200).json({
      status: 200,
      type: "success",
      message: "File Fetched Successfully",
      data: result,
    });
  } catch (error) {
    // logger.error(error.message);

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
      // logger.error(
      //   `${file.owner.fullname} is already edit this pdf if you want to edit now please contact with ${file.owner.fullname}`
      // );

      return res.status(400).json({
        status: 400,
        type: "error",
        message: `${file.owner.fullname} is already edit this pdf if you want to edit now please contact with ${file.owner.fullname}`,
        editable: result.is_editable,
        // data: result,
      });
    }

    // logger.error(`File is Editable`);
    return res.status(200).json({
      status: 200,
      type: "success",
      message: "File is Editable",
      editable: result.is_editable,
      // data: result,
    });
  } catch (error) {
    // logger.error(error.message);

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
  UpdateSignedPdfFile,
  ReviewPdfFile,
  DeletePdfFile,
  ListPdfFiles,
  GetPdfFileById,
  CheckPdfFileIsEditable,
  FileGetById,
};
