"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const uploadController = require("../../controllers/upload.controller ");
const { uploadDisk, uploadMemory } = require("../../configs/multer.config");
const router = express.Router();

// router.use(authenticationV2);
router.post("/product", asyncHandler(uploadController.uploadFile));
router.post(
  "/product/thumb",
  uploadDisk.single("file"),
  asyncHandler(uploadController.uploadFileThumb)
);

// upload s3
// use upload memory because we need to get file.buffer
router.post(
  "/product/bucket",
  uploadMemory.single("file"),
  asyncHandler(uploadController.uploadImageFromLocal)
);

module.exports = router;
