"use strict";

const express = require("express");
const discountController = require("../../controllers/discount.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

// search in here because user not authenticate still can search
// router.get("/search/:keySearch", asyncHandler(discountController.getListSearchProduct));
// router.get("", asyncHandler(discountController.findAllProducts));
// router.get("/:product_id", asyncHandler(discountController.findProduct));

// authentication before logout
router.use(authenticationV2);

router.post("", asyncHandler(discountController.createDiscount));
router.patch("/:discountId", asyncHandler(discountController.updateDiscount));
// router.post("/publish/:id", asyncHandler(discountController.publishProductByShop));
// router.post("/unpublish/:id", asyncHandler(discountController.unpublishProductByShop));

// Query
// router.get("/drafts/all", asyncHandler(discountController.getAllDraftsForShop));
// router.get("/published/all", asyncHandler(discountController.getAllPublishForShop));

module.exports = router;
