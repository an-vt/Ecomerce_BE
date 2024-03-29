"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const commentController = require("../../controllers/comment.controller");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

// authentication before logout
router.get("/list", asyncHandler(commentController.findByParentId));

router.use(authenticationV2);
router.post("", asyncHandler(commentController.createComment));
router.delete("", asyncHandler(commentController.delete));

module.exports = router;
