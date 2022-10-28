import PdfSchema from "../../modal/pdf.model";
import SharedFileSchema from "../../modal/sharedFile.model";
import { Response } from "express";
import logger from "../../logger";

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
          logger.error({
            type: "error",
            status: 400,
            message: `you don’t have permission to share this file. Please contact ${file.owner.fullname} for permission`,
          });
          return res.status(400).json({
            type: "error",
            status: 400,
            message: `you don’t have permission to share this file. Please contact ${file.owner.fullname} for permission`,
          });
        }

        await PdfSchema.findByIdAndUpdate(
          {
            _id: requestedData.fileId,
          },
          { is_shared: true }
        );

        const newSharedFile = new SharedFileSchema({
          senderId: user._id,
          receiverId: requestedData.userId,
          fileId: requestedData.fileId,
        });

        await newSharedFile.save();

        logger.info({
          type: "success",
          status: 200,
          message: "File Send successfully",
          data: newSharedFile,
        });

        res.status(200).json({
          type: "success",
          status: 200,
          message: "File Send successfully",
          data: newSharedFile,
        });
      } else {
        logger.error({
          type: "success",
          status: 400,
          message: "File receiver is required",
          data: "",
        });

        res.status(400).json({
          type: "success",
          status: 400,
          message: "File receiver is required",
          data: "",
        });
      }
    } else {
      logger.error({
        type: "success",
        status: 400,
        message: "File is required",
        data: "",
      });
      res.status(400).json({
        type: "success",
        status: 400,
        message: "File is required",
        data: "",
      });
    }
  } catch (error) {
    logger.error({
      type: "error",
      status: 404,
      message: error.message,
    });
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
      logger.info({
        type: "error",
        status: 400,
        message: `you don’t have permission to change grand access to this file. Please contact ${file.senderId.fullname} for permission`,
      });

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

    logger.info({
      type: "success",
      status: 200,
      message: "File access changes to grand successfully",
      data: updatedData.access,
    });
    res.status(200).json({
      type: "success",
      status: 200,
      message: "File access changes to grand successfully",
      data: updatedData.access,
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
      logger.error({
        type: "error",
        status: 400,
        message: `you don’t have permission to change revoke access to this file. Please contact ${file.senderId.fullname} for permission`,
      });
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

    logger.info({
      type: "success",
      status: 200,
      message: "File access changes to revoke successfully",
      data: updatedData.access,
    });

    res.status(200).json({
      type: "success",
      status: 200,
      message: "File access changes to revoke successfully",
      data: updatedData.access,
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
      logger.error({
        type: "error",
        status: 400,
        message: `you don’t have permission to delete this file. Please contact ${file.senderId.fullname} for permission`,
      });
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

    logger.info({
      type: "success",
      status: 200,
      message: "Shared File deleted successfully",
      data: "",
    });
    res.status(200).json({
      type: "success",
      status: 200,
      message: "Shared File deleted successfully",
      data: "",
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

const ListSenderFile = async (req, res: Response) => {
  try {
    const user = JSON.parse(JSON.stringify(req.user));
    let { page, limit, sort, cond, paginate } = req.body;

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
    if (paginate == undefined) {
      paginate = true;
    }

    limit = parseInt(limit);

    if (paginate == false) {
      const result = await SharedFileSchema.find(cond)
        .populate("senderId")
        .populate("receiverId")
        .populate("fileId")
        .sort(sort);

      logger.info({
        type: "success",
        status: 200,
        message: "Shared File list fetched successfully",
        data: result,
      });

      res.status(200).json({
        type: "success",
        status: 200,
        message: "Shared File list fetched successfully",
        data: result,
      });
    } else if (paginate == true) {
      const result = await SharedFileSchema.find(cond)
        .populate("senderId")
        .populate("receiverId")
        .populate("fileId")
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);

      const result_count = await SharedFileSchema.find(cond).count();
      const totalPages = Math.ceil(result_count / limit);

      logger.info({
        type: "success",
        status: 200,
        message: "Shared File list fetched successfully",
        page: page,
        limit: limit,
        totalPages: totalPages,
        total: result_count,
        data: result,
      });

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
    }
  } catch (error) {
    logger.error(error.message);
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
    let { page, limit, sort, cond, paginate } = req.body;

    if (user) {
      cond = {
        receiverId: user._id,
        access: true,
        isdeleted: false,
        IsSigned: false,
        ...cond,
      };
    }

    if (!page || page < 1) {
      page = 1;
    }
    if (paginate == undefined) {
      paginate = true;
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

    if (paginate !== false) {
      const result = await SharedFileSchema.find(cond)
        .populate("senderId")
        .populate("receiverId")
        .populate("fileId")
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);

      const result_count = await SharedFileSchema.find(cond).count();
      const totalPages = Math.ceil(result_count / limit);

      logger.info({
        type: "success",
        status: 200,
        message: "Shared File list fetched successfully",
        page: page,
        limit: limit,
        totalPages: totalPages,
        total: result_count,
        data: result,
      });

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
    } else if (paginate !== true) {
      const result = await SharedFileSchema.find(cond)
        .populate("senderId")
        .populate("receiverId")
        .populate("fileId")
        .sort(sort);

      logger.info({
        type: "success",
        status: 200,
        message: "Shared File list fetched successfully",
        data: result,
      });

      res.status(200).json({
        type: "success",
        status: 200,
        message: "Shared File list fetched successfully",
        data: result,
      });
    }
  } catch (error) {
    logger.error(error.message);
    return res.status(404).json({
      type: "error",
      status: 404,
      message: error.message,
    });
  }
};

const ListSignedPdfFiles = async (req, res: Response) => {
  try {
    const user = JSON.parse(JSON.stringify(req.user));
    let { page, limit, sort, cond, paginate } = req.body;

    if (user) {
      cond = {
        senderId: user._id,
        access: true,
        isdeleted: false,
        IsSigned: true,
        isReviewd: false,
        ...cond,
      };
    }

    if (!page || page < 1) {
      page = 1;
    }
    if (paginate == undefined) {
      paginate = true;
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

    if (paginate !== false) {
      const result = await SharedFileSchema.find(cond)
        .populate("senderId")
        .populate("receiverId")
        .populate("fileId")
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);

      const result_count = await SharedFileSchema.find(cond).count();

      if (result_count < 1) {
        logger.error("Signed Files not found.");
        throw new Error("Signed Files not found.");
      }

      const totalPages = Math.ceil(result_count / limit);

      logger.info({
        type: "success",
        status: 200,
        message: "Signed Files list fetched successfully",
        page: page,
        limit: limit,
        totalPages: totalPages,
        total: result_count,
        data: result,
      });

      res.status(200).json({
        type: "success",
        status: 200,
        message: "Signed Files list fetched successfully",
        page: page,
        limit: limit,
        totalPages: totalPages,
        total: result_count,
        data: result,
      });
    } else if (paginate !== true) {
      const result = await SharedFileSchema.find(cond)
        .populate("senderId")
        .populate("receiverId")
        .populate("fileId")
        .sort(sort);

      logger.info({
        type: "success",
        status: 200,
        message: "Signed Files list fetched successfully",
        data: result,
      });

      res.status(200).json({
        type: "success",
        status: 200,
        message: "Signed Files list fetched successfully",
        data: result,
      });
    }
  } catch (error) {
    logger.error(error.message);
    return res.status(404).json({
      type: "error",
      status: 404,
      message: error.message,
    });
  }
};

const ListReviewedPdfFiles = async (req, res: Response) => {
  try {
    const user = JSON.parse(JSON.stringify(req.user));
    let { page, limit, sort, cond, paginate } = req.body;

    if (user) {
      cond = {
        senderId: user._id,
        access: true,
        isdeleted: false,
        IsSigned: true,
        isReviewd: true,
        ...cond,
      };
    }

    if (!page || page < 1) {
      page = 1;
    }
    if (paginate == undefined) {
      paginate = true;
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

    if (paginate !== false) {
      const result = await SharedFileSchema.find(cond)
        .populate("senderId")
        .populate("receiverId")
        .populate("fileId")
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);

      const result_count = await SharedFileSchema.find(cond).count();

      if (result_count < 1) {
        logger.error("Reviewed Files not found.");
        throw new Error("Reviewed Files not found.");
      }

      const totalPages = Math.ceil(result_count / limit);

      logger.info({
        type: "success",
        status: 200,
        message: "Reviewed Files list fetched successfully",
        page: page,
        limit: limit,
        totalPages: totalPages,
        total: result_count,
        data: result,
      });

      res.status(200).json({
        type: "success",
        status: 200,
        message: "Reviewed Files list fetched successfully",
        page: page,
        limit: limit,
        totalPages: totalPages,
        total: result_count,
        data: result,
      });
    } else if (paginate !== true) {
      const result = await SharedFileSchema.find(cond)
        .populate("senderId")
        .populate("receiverId")
        .populate("fileId")
        .sort(sort);

      logger.info({
        type: "success",
        status: 200,
        message: "Reviewed Files list fetched successfully",
        data: result,
      });

      res.status(200).json({
        type: "success",
        status: 200,
        message: "Reviewed Files list fetched successfully",
        data: result,
      });
    }
  } catch (error) {
    logger.error(error.message);
    return res.status(404).json({
      type: "error",
      status: 404,
      message: error.message,
    });
  }
};

const ListReviewedFailPdfFiles = async (req, res: Response) => {
  try {
    const user = JSON.parse(JSON.stringify(req.user));
    let { page, limit, sort, cond, paginate } = req.body;

    if (user) {
      cond = {
        senderId: user._id,
        access: true,
        isdeleted: false,
        IsSigned: true,
        isReviewd: true,
        isPassed: false,
        ...cond,
      };
    }

    if (!page || page < 1) {
      page = 1;
    }
    if (paginate == undefined) {
      paginate = true;
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

    if (paginate !== false) {
      const result = await SharedFileSchema.find(cond)
        .populate("senderId")
        .populate("receiverId")
        .populate("fileId")
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);

      const result_count = await SharedFileSchema.find(cond).count();

      if (result_count < 1) {
        logger.error("Reviewed Files not found.");
        throw new Error("Reviewed Files not found.");
      }

      const totalPages = Math.ceil(result_count / limit);

      logger.info({
        type: "success",
        status: 200,
        message: "Reviewed Files list fetched successfully",
        page: page,
        limit: limit,
        totalPages: totalPages,
        total: result_count,
        data: result,
      });

      res.status(200).json({
        type: "success",
        status: 200,
        message: "Reviewed Files list fetched successfully",
        page: page,
        limit: limit,
        totalPages: totalPages,
        total: result_count,
        data: result,
      });
    } else if (paginate !== true) {
      const result = await SharedFileSchema.find(cond)
        .populate("senderId")
        .populate("receiverId")
        .populate("fileId")
        .sort(sort);

      logger.info({
        type: "success",
        status: 200,
        message: "Reviewed Files list fetched successfully",
        data: result,
      });

      res.status(200).json({
        type: "success",
        status: 200,
        message: "Reviewed Files list fetched successfully",
        data: result,
      });
    }
  } catch (error) {
    logger.error(error.message);
    return res.status(404).json({
      type: "error",
      status: 404,
      message: error.message,
    });
  }
};

const ListReviewedPassPdfFiles = async (req, res: Response) => {
  try {
    const user = JSON.parse(JSON.stringify(req.user));
    let { page, limit, sort, cond, paginate } = req.body;

    if (user) {
      cond = {
        senderId: user._id,
        access: true,
        isdeleted: false,
        IsSigned: true,
        isReviewd: true,
        isPassed: true,
        ...cond,
      };
    }

    if (!page || page < 1) {
      page = 1;
    }
    if (paginate == undefined) {
      paginate = true;
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

    if (paginate !== false) {
      const result = await SharedFileSchema.find(cond)
        .populate("senderId")
        .populate("receiverId")
        .populate("fileId")
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);

      const result_count = await SharedFileSchema.find(cond).count();

      if (result_count < 1) {
        logger.error("Reviewed Files not found.");
        throw new Error("Reviewed Files not found.");
      }

      const totalPages = Math.ceil(result_count / limit);

      logger.info({
        type: "success",
        status: 200,
        message: "Reviewed Files list fetched successfully",
        page: page,
        limit: limit,
        totalPages: totalPages,
        total: result_count,
        data: result,
      });

      res.status(200).json({
        type: "success",
        status: 200,
        message: "Reviewed Files list fetched successfully",
        page: page,
        limit: limit,
        totalPages: totalPages,
        total: result_count,
        data: result,
      });
    } else if (paginate !== true) {
      const result = await SharedFileSchema.find(cond)
        .populate("senderId")
        .populate("receiverId")
        .populate("fileId")
        .sort(sort);

      logger.info({
        type: "success",
        status: 200,
        message: "Reviewed Files list fetched successfully",
        data: result,
      });

      res.status(200).json({
        type: "success",
        status: 200,
        message: "Reviewed Files list fetched successfully",
        data: result,
      });
    }
  } catch (error) {
    logger.error(error.message);
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
    let { page, limit, sort, cond, paginate } = req.body;

    const file = req.body.file;

    if (user) {
      cond = { fileId: file, access: true, isdeleted: false, ...cond };
    }

    if (!page || page < 1) {
      page = 1;
    }
    if (paginate == undefined) {
      paginate = true;
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

    if (paginate !== false) {
      const result = await SharedFileSchema.find(cond)
        .populate("senderId")
        .populate("receiverId")
        .populate("fileId")
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);

      const result_count = await SharedFileSchema.find(cond).count();
      const totalPages = Math.ceil(result_count / limit);

      logger.info({
        type: "success",
        status: 200,
        message: "Shared File list fetched successfully",
        page: page,
        limit: limit,
        totalPages: totalPages,
        total: result_count,
        data: result,
      });

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
    } else if (paginate !== true) {
      const result = await SharedFileSchema.find(cond)
        .populate("senderId")
        .populate("receiverId")
        .populate("fileId")
        .sort(sort);

      logger.info({
        type: "success",
        status: 200,
        message: "Shared File list fetched successfully",
        data: result,
      });

      res.status(200).json({
        type: "success",
        status: 200,
        message: "Shared File list fetched successfully",
        data: result,
      });
    }
  } catch (error) {
    logger.error(error.message);
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

    logger.info({
      type: "success",
      status: 200,
      message: "Received File details fetched successfully",
      data: result,
    });
    res.status(200).json({
      type: "success",
      status: 200,
      message: "Received File details fetched successfully",
      data: result,
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

    logger.info({
      type: "success",
      status: 200,
      message: "Send File details fetched successfully",
      data: result,
    });

    res.status(200).json({
      type: "success",
      status: 200,
      message: "Send File details fetched successfully",
      data: result,
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

const FilesGetById = async (req, res: Response) => {
  try {
    const { fileId } = req.params;

    const result = await SharedFileSchema.find({
      _id: fileId,
      isdeleted: false,
    })
      .populate("senderId")
      .populate("receiverId")
      .populate("fileId");

    logger.info({
      status: 200,
      type: "success",
      message: "File Fetched Successfully",
      data: result,
    });

    return res.status(200).json({
      status: 200,
      type: "success",
      message: "File Fetched Successfully",
      data: result,
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
  ListSignedPdfFiles,
  ListReviewedPdfFiles,
  ListReviewedFailPdfFiles,
  ListReviewedPassPdfFiles,
  FilesGetById,
};
