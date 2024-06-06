"use strict";

const express = require("express");
const emailController = require("../../controllers/email.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

router.post("/new_template", asyncHandler(emailController.newTemplate));

module.exports = router;
