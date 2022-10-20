import PdfSchema from "../../modal/pdf.model";
import SharedFileSchema from "../../modal/sharedFile.model";
import { Response } from "express";

export interface ISHAREDFILE {
  senderId?: string;
  receiverId?: string;
  fileId?: string;
  comment: string;
  access: boolean;
  IsSigned: boolean;
  isdeleted: boolean;
  file_is_open: boolean;
  deleted_at: Date;
  file_open_at: Date;
}

const ShareFile = async (req, res: Response) => {
  try {
    const requestedData = req.body;
    const user = JSON.parse(JSON.stringify(req.user));

    if (requestedData.fileId) {
      if (requestedData.userId) {
        const fileData = await PdfSchema.findOne({
          _id: requestedData.fileId,
          isdeleted: false,
        }).populate("owner");

        const file = JSON.parse(JSON.stringify(fileData));

        if (file.owner._id !== user._id) {
          return res.status(400).json({
            type: "error",
            status: 400,
            message: `you don’t have permission to share this file. Please contact ${file.owner.fullname} for permission`,
          });
        }

        const newSharedFile = new SharedFileSchema({
          senderId: user._id,
          receiverId: requestedData.userId,
          fileId: requestedData.fileId,
        });

        await newSharedFile.save();

        res.status(200).json({
          type: "success",
          status: 200,
          message: "File Send successfully",
          data: newSharedFile,
        });
      } else {
        res.status(400).json({
          type: "success",
          status: 400,
          message: "File receiver is required",
          data: "",
        });
      }
    } else {
      res.status(400).json({
        type: "success",
        status: 400,
        message: "File is required",
        data: "",
      });
    }
  } catch (error) {
    return res.status(404).json({
      type: "error",
      status: 404,
      message: error.message,
    });
  }
};

const GrandAccess = async (req, res: Response) => {
  try {
    const user = JSON.parse(JSON.stringify(req.user));
    const id = req.params.id;

    const fileData = await SharedFileSchema.findOne({
      _id: id,
      isdeleted: false,
    }).populate("senderId");

    const file = JSON.parse(JSON.stringify(fileData));

    if (file.senderId._id !== user._id) {
      return res.status(400).json({
        type: "error",
        status: 400,
        message: `you don’t have permission to change grand access to this file. Please contact ${file.senderId.fullname} for permission`,
      });
    }

    const requestData = {
      access: true,
      IsSigned: true,
      updated_at: Date.now(),
    };

    await SharedFileSchema.findByIdAndUpdate(
      {
        _id: id,
      },
      requestData
    );

    const updatedData = await SharedFileSchema.findOne({
      _id: id,
      isdeleted: false,
    });

    res.status(200).json({
      type: "success",
      status: 200,
      message: "File access changes to grand successfully",
      data: updatedData.access,
    });
  } catch (error) {
    return res.status(404).json({
      type: "error",
      status: 404,
      message: error.message,
    });
  }
};

const RevokeAccess = async (req, res: Response) => {
  try {
    const user = JSON.parse(JSON.stringify(req.user));
    const id = req.params.id;

    const fileData = await SharedFileSchema.findOne({
      _id: id,
      isdeleted: false,
    }).populate("senderId");

    const file = JSON.parse(JSON.stringify(fileData));

    if (file.senderId._id !== user._id) {
      return res.status(400).json({
        type: "error",
        status: 400,
        message: `you don’t have permission to change revoke access to this file. Please contact ${file.senderId.fullname} for permission`,
      });
    }

    const requestData = {
      access: false,
      IsSigned: false,
      updated_at: Date.now(),
    };

    await SharedFileSchema.findByIdAndUpdate(
      {
        _id: id,
      },
      requestData
    );

    const updatedData = await SharedFileSchema.findOne({
      _id: id,
      isdeleted: false,
    });

    res.status(200).json({
      type: "success",
      status: 200,
      message: "File access changes to revoke successfully",
      data: updatedData.access,
    });
  } catch (error) {
    return res.status(404).json({
      type: "error",
      status: 404,
      message: error.message,
    });
  }
};

const DeleteSharedFile = async (req, res: Response) => {
  try {
    const user = JSON.parse(JSON.stringify(req.user));
    const id = req.params.id;

    const fileData = await SharedFileSchema.findOne({
      _id: id,
      isdeleted: false,
    }).populate("senderId");

    const file = JSON.parse(JSON.stringify(fileData));

    if (file.senderId._id !== user._id) {
      return res.status(400).json({
        type: "error",
        status: 400,
        message: `you don’t have permission to delete this file. Please contact ${file.senderId.fullname} for permission`,
      });
    }

    const requestData = {
      isdeleted: true,
      deleted_at: Date.now(),
    };

    await SharedFileSchema.findByIdAndUpdate(
      {
        _id: id,
      },
      requestData
    );

    res.status(200).json({
      type: "success",
      status: 200,
      message: "Shared File deleted successfully",
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

const ListSenderFile = async (req, res: Response) => {
  try {
    const user = JSON.parse(JSON.stringify(req.user));
    let { page, limit, sort, cond } = req.body;

    if (user) {
      cond = { senderId: user._id, access: true, isdeleted: false, ...cond };
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

    const result = await SharedFileSchema.find(cond)
      .populate("senderId")
      .populate("receiverId")
      .populate("fileId")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const result_count = await SharedFileSchema.find(cond).count();
    const totalPages = Math.ceil(result_count / limit);

    res.status(200).json({
      type: "success",
      status: 200,
      message: "Shared File list fetched successfully",
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

const ListReceivedFile = async (req, res: Response) => {
  try {
    const user = JSON.parse(JSON.stringify(req.user));
    let { page, limit, sort, cond } = req.body;

    if (user) {
      cond = { receiverId: user._id, access: true, isdeleted: false, ...cond };
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

    const result = await SharedFileSchema.find(cond)
      .populate("senderId")
      .populate("receiverId")
      .populate("fileId")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const result_count = await SharedFileSchema.find(cond).count();
    const totalPages = Math.ceil(result_count / limit);

    res.status(200).json({
      type: "success",
      status: 200,
      message: "Received File list fetched successfully",
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

const ReceivedFileById = async (req, res: Response) => {
  try {
    const user = JSON.parse(JSON.stringify(req.user));
    const id = req.params.id;

    const result = await SharedFileSchema.find({
      _id: id,
      receiverId: user._id,
      access: true,
      isdeleted: false,
    })
      .populate("senderId")
      .populate("receiverId")
      .populate("fileId");

    res.status(200).json({
      type: "success",
      status: 200,
      message: "Received File details fetched successfully",
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

const SendFileById = async (req, res: Response) => {
  try {
    const user = JSON.parse(JSON.stringify(req.user));
    const id = req.params.id;

    const result = await SharedFileSchema.find({
      _id: id,
      senderId: user._id,
      access: true,
      isdeleted: false,
    })
      .populate("senderId")
      .populate("receiverId")
      .populate("fileId");

    res.status(200).json({
      type: "success",
      status: 200,
      message: "Send File details fetched successfully",
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

const getByFileId = async (req, res: Response) => {
  try {
    const user = JSON.parse(JSON.stringify(req.user));
    let { page, limit, sort, cond } = req.body;

    const file = req.body.file;

    if (user) {
      cond = { fileId: file, access: true, isdeleted: false, ...cond };
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

    const result = await SharedFileSchema.find(cond)
      .populate("senderId")
      .populate("receiverId")
      .populate("fileId")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const result_count = await SharedFileSchema.find(cond).count();
    const totalPages = Math.ceil(result_count / limit);

    res.status(200).json({
      type: "success",
      status: 200,
      message: "File list fetched successfully",
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

export default {
  ShareFile,
  GrandAccess,
  RevokeAccess,
  DeleteSharedFile,
  ListSenderFile,
  ListReceivedFile,
  SendFileById,
  ReceivedFileById,
  getByFileId,
};
