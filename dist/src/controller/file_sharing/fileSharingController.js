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
const pdf_model_1 = __importDefault(require("../../modal/pdf.model"));
const sharedFile_model_1 = __importDefault(require("../../modal/sharedFile.model"));
const logger_1 = __importDefault(require("../../logger"));
const FilesGetById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fileId } = req.params;
        const result = yield sharedFile_model_1.default.find({
            _id: fileId,
            isdeleted: false,
        })
            .populate("senderId")
            .populate("receiverId")
            .populate("fileId");
        logger_1.default.info({
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
const ShareFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestedData = req.body;
        const user = JSON.parse(JSON.stringify(req.user));
        if (requestedData.fileId) {
            if (requestedData.userId) {
                const fileData = yield pdf_model_1.default.findOne({
                    _id: requestedData.fileId,
                    isdeleted: false,
                }).populate("owner");
                const file = JSON.parse(JSON.stringify(fileData));
                if (file.owner._id !== user._id) {
                    logger_1.default.error({
                        type: "error",
                        status: 200,
                        message: `you don???t have permission to share this file. Please contact ${file.owner.fullname} for permission`,
                    });
                    return res.status(200).json({
                        type: "error",
                        status: 200,
                        message: `you don???t have permission to share this file. Please contact ${file.owner.fullname} for permission`,
                    });
                }
                yield pdf_model_1.default.findByIdAndUpdate({
                    _id: requestedData.fileId,
                }, { is_shared: true });
                const newSharedFile = new sharedFile_model_1.default({
                    senderId: user._id,
                    receiverId: requestedData.userId,
                    fileId: requestedData.fileId,
                });
                yield newSharedFile.save();
                logger_1.default.info({
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
            }
            else {
                logger_1.default.error({
                    type: "success",
                    status: 200,
                    message: "File receiver is required",
                    data: "",
                });
                res.status(200).json({
                    type: "success",
                    status: 200,
                    message: "File receiver is required",
                    data: "",
                });
            }
        }
        else {
            logger_1.default.error({
                type: "success",
                status: 200,
                message: "File is required",
                data: "",
            });
            res.status(200).json({
                type: "success",
                status: 200,
                message: "File is required",
                data: "",
            });
        }
    }
    catch (error) {
        logger_1.default.error({
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
});
const ListReviewedPdfFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = JSON.parse(JSON.stringify(req.user));
        let { page, limit, sort, cond, paginate } = req.body;
        if (user) {
            cond = Object.assign({ senderId: user._id, access: true, isdeleted: false, IsSigned: true, isReviewd: true }, cond);
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
            const result = yield sharedFile_model_1.default.find(cond)
                .populate("senderId")
                .populate("receiverId")
                .populate("fileId")
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit);
            const result_count = yield sharedFile_model_1.default.find(cond).count();
            const totalPages = Math.ceil(result_count / limit);
            logger_1.default.info({
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
        }
        else if (paginate !== true) {
            const result = yield sharedFile_model_1.default.find(cond)
                .populate("senderId")
                .populate("receiverId")
                .populate("fileId")
                .sort(sort);
            logger_1.default.info({
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
const ListReceivedFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = JSON.parse(JSON.stringify(req.user));
        let { page, limit, sort, cond, paginate } = req.body;
        if (user) {
            cond = Object.assign({ receiverId: user._id, access: true, isdeleted: false, IsSigned: false }, cond);
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
            const result = yield sharedFile_model_1.default.find(cond)
                .populate("senderId")
                .populate("receiverId")
                .populate("fileId")
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit);
            const result_count = yield sharedFile_model_1.default.find(cond).count();
            const totalPages = Math.ceil(result_count / limit);
            logger_1.default.info({
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
        else if (paginate !== true) {
            const result = yield sharedFile_model_1.default.find(cond)
                .populate("senderId")
                .populate("receiverId")
                .populate("fileId")
                .sort(sort);
            logger_1.default.info({
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
const ListSignedPdfFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = JSON.parse(JSON.stringify(req.user));
        let { page, limit, sort, cond, paginate } = req.body;
        if (user) {
            cond = Object.assign({ senderId: user._id, access: true, isdeleted: false, IsSigned: true, isReviewd: false }, cond);
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
            const result = yield sharedFile_model_1.default.find(cond)
                .populate("senderId")
                .populate("receiverId")
                .populate("fileId")
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit);
            const result_count = yield sharedFile_model_1.default.find(cond).count();
            const totalPages = Math.ceil(result_count / limit);
            logger_1.default.info({
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
        }
        else if (paginate !== true) {
            const result = yield sharedFile_model_1.default.find(cond)
                .populate("senderId")
                .populate("receiverId")
                .populate("fileId")
                .sort(sort);
            logger_1.default.info({
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
// Routes Not in use currenly
const GrandAccess = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = JSON.parse(JSON.stringify(req.user));
        const id = req.params.id;
        const fileData = yield sharedFile_model_1.default.findOne({
            _id: id,
            isdeleted: false,
        }).populate("senderId");
        const file = JSON.parse(JSON.stringify(fileData));
        if (file.senderId._id !== user._id) {
            logger_1.default.info({
                type: "error",
                status: 200,
                message: `you don???t have permission to change grand access to this file. Please contact ${file.senderId.fullname} for permission`,
            });
            return res.status(200).json({
                type: "error",
                status: 200,
                message: `you don???t have permission to change grand access to this file. Please contact ${file.senderId.fullname} for permission`,
            });
        }
        const requestData = {
            access: true,
            IsSigned: true,
            updated_at: Date.now(),
        };
        yield sharedFile_model_1.default.findByIdAndUpdate({
            _id: id,
        }, requestData);
        const updatedData = yield sharedFile_model_1.default.findOne({
            _id: id,
            isdeleted: false,
        });
        logger_1.default.info({
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
const RevokeAccess = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = JSON.parse(JSON.stringify(req.user));
        const id = req.params.id;
        const fileData = yield sharedFile_model_1.default.findOne({
            _id: id,
            isdeleted: false,
        }).populate("senderId");
        const file = JSON.parse(JSON.stringify(fileData));
        if (file.senderId._id !== user._id) {
            logger_1.default.error({
                type: "error",
                status: 200,
                message: `you don???t have permission to change revoke access to this file. Please contact ${file.senderId.fullname} for permission`,
            });
            return res.status(200).json({
                type: "error",
                status: 200,
                message: `you don???t have permission to change revoke access to this file. Please contact ${file.senderId.fullname} for permission`,
            });
        }
        const requestData = {
            access: false,
            IsSigned: false,
            updated_at: Date.now(),
        };
        yield sharedFile_model_1.default.findByIdAndUpdate({
            _id: id,
        }, requestData);
        const updatedData = yield sharedFile_model_1.default.findOne({
            _id: id,
            isdeleted: false,
        });
        logger_1.default.info({
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
const DeleteSharedFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = JSON.parse(JSON.stringify(req.user));
        const id = req.params.id;
        const fileData = yield sharedFile_model_1.default.findOne({
            _id: id,
            isdeleted: false,
        }).populate("senderId");
        const file = JSON.parse(JSON.stringify(fileData));
        if (file.senderId._id !== user._id) {
            logger_1.default.error({
                type: "error",
                status: 200,
                message: `you don???t have permission to delete this file. Please contact ${file.senderId.fullname} for permission`,
            });
            return res.status(200).json({
                type: "error",
                status: 200,
                message: `you don???t have permission to delete this file. Please contact ${file.senderId.fullname} for permission`,
            });
        }
        const requestData = {
            isdeleted: true,
            deleted_at: Date.now(),
        };
        yield sharedFile_model_1.default.findByIdAndUpdate({
            _id: id,
        }, requestData);
        logger_1.default.info({
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
const ListSenderFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = JSON.parse(JSON.stringify(req.user));
        let { page, limit, sort, cond, paginate } = req.body;
        if (user) {
            cond = Object.assign({ senderId: user._id, access: true, isdeleted: false }, cond);
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
            const result = yield sharedFile_model_1.default.find(cond)
                .populate("senderId")
                .populate("receiverId")
                .populate("fileId")
                .sort(sort);
            logger_1.default.info({
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
        else if (paginate == true) {
            const result = yield sharedFile_model_1.default.find(cond)
                .populate("senderId")
                .populate("receiverId")
                .populate("fileId")
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit);
            const result_count = yield sharedFile_model_1.default.find(cond).count();
            const totalPages = Math.ceil(result_count / limit);
            logger_1.default.info({
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
const ListReviewedFailPdfFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = JSON.parse(JSON.stringify(req.user));
        let { page, limit, sort, cond, paginate } = req.body;
        if (user) {
            cond = Object.assign({ senderId: user._id, access: true, isdeleted: false, IsSigned: true, isReviewd: true, isPassed: false }, cond);
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
            const result = yield sharedFile_model_1.default.find(cond)
                .populate("senderId")
                .populate("receiverId")
                .populate("fileId")
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit);
            const result_count = yield sharedFile_model_1.default.find(cond).count();
            // if (result_count < 1) {
            //   logger.error("Reviewed Files not found.");
            //   res.status(200).json({
            //     type: "success",
            //     status: 200,
            //     message: "Reviewed Files not found.",
            //     data: "",
            //   });
            // }
            const totalPages = Math.ceil(result_count / limit);
            logger_1.default.info({
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
        }
        else if (paginate !== true) {
            const result = yield sharedFile_model_1.default.find(cond)
                .populate("senderId")
                .populate("receiverId")
                .populate("fileId")
                .sort(sort);
            logger_1.default.info({
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
const ListReviewedPassPdfFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = JSON.parse(JSON.stringify(req.user));
        let { page, limit, sort, cond, paginate } = req.body;
        if (user) {
            cond = Object.assign({ senderId: user._id, access: true, isdeleted: false, IsSigned: true, isReviewd: true, isPassed: true }, cond);
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
            const result = yield sharedFile_model_1.default.find(cond)
                .populate("senderId")
                .populate("receiverId")
                .populate("fileId")
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit);
            const result_count = yield sharedFile_model_1.default.find(cond).count();
            // if (result_count < 1) {
            //   logger.error("Reviewed Files not found.");
            //   res.status(200).json({
            //     type: "success",
            //     status: 200,
            //     message: "Reviewed Files not found.",
            //     data: "",
            //   });
            // }
            const totalPages = Math.ceil(result_count / limit);
            logger_1.default.info({
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
        }
        else if (paginate !== true) {
            const result = yield sharedFile_model_1.default.find(cond)
                .populate("senderId")
                .populate("receiverId")
                .populate("fileId")
                .sort(sort);
            logger_1.default.info({
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
const getByFileId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = JSON.parse(JSON.stringify(req.user));
        let { page, limit, sort, cond, paginate } = req.body;
        const file = req.body.file;
        if (user) {
            cond = Object.assign({ fileId: file, access: true, isdeleted: false }, cond);
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
            const result = yield sharedFile_model_1.default.find(cond)
                .populate("senderId")
                .populate("receiverId")
                .populate("fileId")
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit);
            const result_count = yield sharedFile_model_1.default.find(cond).count();
            const totalPages = Math.ceil(result_count / limit);
            logger_1.default.info({
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
        else if (paginate !== true) {
            const result = yield sharedFile_model_1.default.find(cond)
                .populate("senderId")
                .populate("receiverId")
                .populate("fileId")
                .sort(sort);
            logger_1.default.info({
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
const ReceivedFileById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = JSON.parse(JSON.stringify(req.user));
        const id = req.params.id;
        const result = yield sharedFile_model_1.default.find({
            _id: id,
            receiverId: user._id,
            access: true,
            isdeleted: false,
        })
            .populate("senderId")
            .populate("receiverId")
            .populate("fileId");
        logger_1.default.info({
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
const SendFileById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = JSON.parse(JSON.stringify(req.user));
        const id = req.params.id;
        const result = yield sharedFile_model_1.default.find({
            _id: id,
            senderId: user._id,
            access: true,
            isdeleted: false,
        })
            .populate("senderId")
            .populate("receiverId")
            .populate("fileId");
        logger_1.default.info({
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
    FilesGetById,
    ShareFile,
    ListReviewedPdfFiles,
    ListReceivedFile,
    ListSignedPdfFiles,
    // Routes not in use Currenly
    GrandAccess,
    RevokeAccess,
    DeleteSharedFile,
    ListSenderFile,
    ListReviewedFailPdfFiles,
    SendFileById,
    ReceivedFileById,
    getByFileId,
    ListReviewedPassPdfFiles,
};
//# sourceMappingURL=fileSharingController.js.map