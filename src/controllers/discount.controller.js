"use strict";
const { CREATED, SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
  createDiscount = async (req, res, next) => {
    new SuccessResponse({
      message: "Create discount success",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  updateDiscount = async (req, res, next) => {
    new SuccessResponse({
      message: "Update discount success",
      metadata: await DiscountService.updateDiscountCode(
        req.params.discountId,
        {
          ...req.body,
          shopId: req.user.userId,
        }
      ),
    }).send(res);
  };

  getAllProductByDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all product from discount success",
      metadata: await DiscountService.getAllProductFromDiscountCode({
        code: req.params.discountCode,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getAllDiscountCodeByShopId = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all discount code from shop id success",
      metadata: await DiscountService.getAllDiscountCodeFromShopId({
        shopId: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
