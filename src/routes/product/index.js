"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

// search in here because user not authenticate still can search
router.get("/search/:keySearch", asyncHandler(productController.getListSearchProduct));

// authentication before logout
router.use(authenticationV2);

router.post("", asyncHandler(productController.createProduct));
router.post("/publish/:id", asyncHandler(productController.publishProductByShop));
router.post("/unpublish/:id", asyncHandler(productController.unpublishProductByShop));

// Query
router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));
router.get("/published/all", asyncHandler(productController.getAllPublishForShop));

module.exports = router;
