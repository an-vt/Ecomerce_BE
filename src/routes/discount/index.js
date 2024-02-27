"use strict";

const express = require("express");
const discountController = require("../../controllers/discount.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

router.get("/all", asyncHandler(discountController.getAllDiscountCodeByShopId));
router.get(
  "/product/:discountCode",
  asyncHandler(discountController.getAllProductByDiscountCode)
);

// authentication before logout
router.use(authenticationV2);

router.post("", asyncHandler(discountController.createDiscount));
router.patch("/:discountId", asyncHandler(discountController.updateDiscount));

module.exports = router;
