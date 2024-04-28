"use strict";

const { SuccessResponse } = require("../core/success.response");
const { uploadImageFromUrl } = require("../services/upload.service");

class UploadController {
  uploadFile = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new Cart success",
      metadata: await uploadImageFromUrl(req.body),
    }).send(res);
  };
}

module.exports = new UploadController();
