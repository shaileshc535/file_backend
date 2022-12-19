"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const pdf_model_1 = __importDefault(require("../../modal/pdf.model"));
const sharedFile_model_1 = __importDefault(require("../../modal/sharedFile.model"));
const logger_1 = __importDefault(require("../../logger"));
const ObjectId = mongoose_1.default.Types.ObjectId;
const AddNewPdf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = JSON.parse(JSON.stringify(req.user));
        if (!req.file) {
            logger_1.default.error("Please upload a file");
            return res.status(400).json({
                message: "Please upload a file",
            });
        }
        const base_url = process.env.BASE_URL;
        const file_url = base_url + "/public/pdf/" + req.file.filename;
        const newFile = new pdf_model_1.default({
            owner: user._id,
            docname: req.body.docname,
            filename: req.file.filename,
            file_url: file_url,
            filetype: req.file.mimetype,
            filesize: req.file.size,
        });
        yield newFile.save();
        logger_1.default.info("File Uploaded successfully");
        res.status(200).json({
            type: "success",
            status: 200,
            message: "File Uploaded successfully",
            data: newFile,
        });
    }
    catch (error) {
        logger_1.default.error(error.message);
        return res.status(404).json({
            type: "error",
            status: 404,
            message: error.message,
        });
    }
});
const UpdatePdfFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            logger_1.default.error("Please upload a file First");
            return res.status(400).json({
                type: "error",
                status: 400,
                message: "Please upload a file First",
            });
        }
        const { fileId } = req.body;
        const base_url = process.env.BASE_URL;
        const file_url = base_url + "/public/pdf/" + req.file.filename;
        const fileData = yield pdf_model_1.default.findOne({
            _id: fileId,
            isdeleted: false,
        }).populate("owner");
        if (!fileData) {
            logger_1.default.error("File not found");
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
        yield pdf_model_1.default.findByIdAndUpdate({
            _id: fileId,
        }, requestData);
        const updatedData = yield pdf_model_1.default.findOne({
            _id: fileId,
            isdeleted: false,
        });
        logger_1.default.error("File Uploaded successfully.");
        res.status(200).json({
            type: "success",
            status: 200,
            message: "File Uploaded successfully",
            data: updatedData,
        });
    }
    catch (error) {
        logger_1.default.error(error.message);
        return res.status(404).json({
            type: "error",
            status: 404,
            message: error.message,
        });
    }
});
const ReviewPdfFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body.fileId;
        const user = JSON.parse(JSON.stringify(req.user));
        const fileData = yield pdf_model_1.default.findOne({
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
            logger_1.default.error(`This file is not a shared file. Please contact ${file.owner.fullname} for permission`);
            return res.status(400).json({
                type: "error",
                status: 400,
                message: `This file is not a shared file. Please contact ${file.owner.fullname} for permission`,
                data: "",
            });
        }
        if (file.is_signed !== true) {
            logger_1.default.error(`this file is not signed. Please contact ${file.owner.fullname} for permission`);
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
        yield pdf_model_1.default.findByIdAndUpdate({
            _id: id,
        }, requestData);
        const updatedData = yield pdf_model_1.default.findOne({
            _id: id,
        });
        logger_1.default.error("file review & passed successfully.");
        res.status(200).json({
            type: "success",
            status: 200,
            message: "file review & passed successfully.",
            data: updatedData,
        });
    }
    catch (error) {
        logger_1.default.error(error.message);
        return res.status(404).json({
            type: "error",
            status: 404,
            message: error.message,
        });
    }
});
const ReviewFail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body.fileId;
        const fileData = yield pdf_model_1.default.findOne({
            _id: id,
            isdeleted: false,
        }).populate("owner");
        if (!fileData) {
            logger_1.default.error(`File not found`);
            return res.status(400).json({
                type: "error",
                status: 400,
                message: "File not found",
            });
        }
        const file = JSON.parse(JSON.stringify(fileData));
        if (file.is_shared !== true) {
            logger_1.default.error(`This file is not a shared file. Please contact ${file.owner.fullname} for permission`);
            return res.status(400).json({
                type: "error",
                status: 400,
                message: `This file is not a shared file. Please contact ${file.owner.fullname} for permission`,
                data: "",
            });
        }
        if (file.is_signed !== true) {
            logger_1.default.error(`this file is not signed. Please contact ${file.owner.fullname} for permission`);
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
        yield pdf_model_1.default.findByIdAndUpdate({
            _id: id,
        }, requestData);
        const updatedData = yield pdf_model_1.default.findOne({
            _id: id,
        });
        logger_1.default.error("file review failed.");
        res.status(200).json({
            type: "success",
            status: 200,
            message: "file review failed.",
            data: updatedData,
        });
    }
    catch (error) {
        logger_1.default.error(error.message);
        return res.status(404).json({
            type: "error",
            status: 404,
            message: error.message,
        });
    }
});
const DeletePdfFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.fileId;
        const user = JSON.parse(JSON.stringify(req.user));
        const fileData = yield pdf_model_1.default.findOne({
            _id: id,
            isdeleted: false,
        }).populate("owner");
        const file = JSON.parse(JSON.stringify(fileData));
        if (file.owner._id !== user._id) {
            logger_1.default.error(`you don’t have permission to delete this file. Please contact ${file.owner.fullname} for permission`);
            return res.status(400).json({
                type: "error",
                status: 400,
                message: `you don’t have permission to delete this file. Please contact ${file.owner.fullname} for permission`,
            });
        }
        if (!fileData) {
            logger_1.default.error(`File not found`);
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
        yield pdf_model_1.default.findByIdAndUpdate({
            _id: id,
        }, requestData);
        yield sharedFile_model_1.default.findOneAndUpdate({
            fileId: id,
        }, requestData);
        logger_1.default.error("File Deleted Successfully");
        res.status(200).json({
            type: "success",
            status: 200,
            message: "File Deleted successfully",
            data: "",
        });
    }
    catch (error) {
        logger_1.default.error(error.message);
        return res.status(404).json({
            type: "error",
            status: 404,
            message: error.message,
        });
    }
});
const ListPdfFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const result = yield pdf_model_1.default.aggregate(cond);
        if (paginate !== false) {
            let totalPages = 0;
            if (result[0].total.length != 0) {
                totalPages = Math.ceil(result[0].total[0].count / limit);
            }
            logger_1.default.info({
                status: 200,
                type: "success",
                message: "Files Fetch Successfully",
                page: page,
                limit: limit,
                totalPages: totalPages,
                total: result[0].total.length != 0 ? result[0].total[0].count : 0,
                data: result[0].data,
            });
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
        }
        else {
            logger_1.default.info({
                status: 200,
                type: "success",
                message: "Files Fetch Successfully",
                data: result[0].data,
            });
            return res.status(200).json({
                status: 200,
                type: "success",
                message: "Files Fetch Successfully",
                data: result[0].data,
            });
        }
    }
    catch (error) {
        logger_1.default.error(error.message);
        return res.status(404).json({
            type: "error",
            status: 404,
            message: error.message,
        });
    }
});
const GetPdfFileById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fileId } = req.params;
        const result = yield pdf_model_1.default.find({
            _id: fileId,
            isdeleted: false,
        }).populate("owner");
        logger_1.default.error("File Fetched Successfully");
        return res.status(200).json({
            status: 200,
            type: "success",
            message: "File Fetched Successfully",
            data: result,
        });
    }
    catch (error) {
        logger_1.default.error(error.message);
        return res.status(404).json({
            type: "error",
            status: 404,
            message: error.message,
        });
    }
});
const FileGetById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fileId } = req.params;
        const result = yield pdf_model_1.default.find({
            _id: fileId,
            isdeleted: false,
        }).populate("owner");
        logger_1.default.error(`File Fetched Successfully`);
        return res.status(200).json({
            status: 200,
            type: "success",
            message: "File Fetched Successfully",
            data: result,
        });
    }
    catch (error) {
        logger_1.default.error(error.message);
        return res.status(404).json({
            type: "error",
            status: 404,
            message: error.message,
        });
    }
});
const CheckPdfFileIsEditable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fileId } = req.params;
        const result = yield pdf_model_1.default.findById({
            _id: fileId,
        }).populate("owner");
        const file = JSON.parse(JSON.stringify(result));
        if (result.is_editable !== true) {
            logger_1.default.error(`${file.owner.fullname} is already edit this pdf if you want to edit now please contact with ${file.owner.fullname}`);
            return res.status(400).json({
                status: 400,
                type: "error",
                message: `${file.owner.fullname} is already edit this pdf if you want to edit now please contact with ${file.owner.fullname}`,
                editable: result.is_editable,
                // data: result,
            });
        }
        logger_1.default.error(`File is Editable`);
        return res.status(200).json({
            status: 200,
            type: "success",
            message: "File is Editable",
            editable: result.is_editable,
            // data: result,
        });
    }
    catch (error) {
        logger_1.default.error(error.message);
        return res.status(404).json({
            type: "error",
            status: 404,
            message: error.message,
        });
    }
});
exports.default = {
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
//# sourceMappingURL=pdfController.js.map