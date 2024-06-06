"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const userController = require("../../controllers/user.controller");
const router = express.Router();

router.post("/new_user", asyncHandler(userController.newUser));

module.exports = router;
