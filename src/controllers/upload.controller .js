"use strict";

const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const { uploadImageFromLocalS3 } = require("../services/aws.upload.service");
const {
  uploadImageFromUrl,
  uploadImageFromLocal,
} = require("../services/cloudinary.upload.service");

class UploadController {
  uploadFile = async (req, res, next) => {
    new SuccessResponse({
      message: "Upload File success",
      metadata: await uploadImageFromUrl(req.body),
    }).send(res);
  };

  uploadFileThumb = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError("File is required");
    }
    new SuccessResponse({
      message: "Upload File thumb cloudinary success",
      metadata: await uploadImageFromLocal({
        path: file.path,
        folderName: "product/shop01",
      }),
    }).send(res);
  };

  uploadImageFromLocal = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError("File is required");
    }
    new SuccessResponse({
      message: "Upload successful image local s3",
      metadata: await uploadImageFromLocalS3({
        file,
      }),
    }).send(res);
  };
}

module.exports = new UploadController();
