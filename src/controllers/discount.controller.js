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
}

module.exports = new DiscountController();
