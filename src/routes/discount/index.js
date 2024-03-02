"use strict";

const express = require("express");
const discountController = require("../../controllers/discount.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

router.get(
  "/list_product_Code",
  asyncHandler(discountController.getAllProductByDiscountCode)
);
router.post("/amount", asyncHandler(discountController.getDiscountAmount));

// authentication before logout
router.use(authenticationV2);

router.get("", asyncHandler(discountController.getAllDiscountCodeByShopId));
router.post("", asyncHandler(discountController.createDiscount));
router.patch("/:discountId", asyncHandler(discountController.updateDiscount));

module.exports = router;
