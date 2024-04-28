"use strict";

const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const {
  uploadImageFromUrl,
  uploadImageFromLocal,
} = require("../services/upload.service");

class UploadController {
  uploadFile = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new Cart success",
      metadata: await uploadImageFromUrl(req.body),
    }).send(res);
  };

  uploadFileThumb = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError("File is required");
    }
    new SuccessResponse({
      message: "Create new Cart success",
      metadata: await uploadImageFromLocal({
        path: file.path,
        folderName: "product/shop01",
      }),
    }).send(res);
  };
}

module.exports = new UploadController();
