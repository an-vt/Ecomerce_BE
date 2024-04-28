"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const uploadController = require("../../controllers/upload.controller ");
const router = express.Router();

// router.use(authenticationV2);
router.post("/product", asyncHandler(uploadController.uploadFile));

module.exports = router;
