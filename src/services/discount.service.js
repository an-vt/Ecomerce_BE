"use strict";

const { convertToObjectIdMongodb, removeUndefinedObject } = require("../utils");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { discountModel, DiscountType } = require("../models/discount.model");
const { findAllProducts } = require("../models/repositories/product.repo");
const {
  findAllDiscountCodeUnSelect,
  updateDiscountByIdAndShopId,
  checkDiscountExists,
} = require("../models/repositories/discount.repo");
const { DateValidation } = require("../validation/date");

/*
  Discount Service
  1 - Generate Discount Shop [User | Admin]
  2 - Get discount amount [User]
  3 - Get all discount code [User | Shop]
  4 - Verify discount code [User]
  5 - Delete discount code [Admin | Shop]
  6 - Cancel discount code [User]
*/

class DiscountService {
  static createDiscountCode = async (payload) => {
    const {
      name,
      description,
      type,
      value,
      code,
      start_date,
      end_date,
      max_uses,
      used_count,
      users_used,
      max_uses_per_user,
      min_order_value,
      shopId,
      is_active,
      applies_to,
      product_ids,
    } = payload;
    if (
      DateValidation.isAfter(new Date(), new Date(start_date)) ||
      DateValidation.isAfter(new Date(), new Date(end_date))
    ) {
      throw new BadRequestError("Discount code has expired!");
    }

    if (DateValidation.isSameOrAfter(start_date, end_date)) {
      throw new BadRequestError("End date must be greater start date");
    }

    // create index for discount code
    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      })
      .lean();

    if (foundDiscount) {
      throw new BadRequestError("Discount exists");
    }

    const newDiscount = await discountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_used_count: used_count,
      discount_users_used: users_used,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value || 0,
      discount_shopId: shopId,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
    });

    return newDiscount;
  };

  static updateDiscountCode = async (discountId, payload) => {
    const { shopId, product_ids, end_date, start_date } = payload;

    if (!shopId) throw new BadRequestError("Invalid params");

    if (
      isAfter(new Date(), new Date(start_date)) ||
      isAfter(new Date(), new Date(end_date))
    ) {
      throw new BadRequestError("Discount code has expired!");
    }

    if (DateValidation.isSameOrAfter(start_date, end_date)) {
      throw new BadRequestError("End date must be greater start date");
    }

    const objectParams = removeUndefinedObject({
      discount_product_ids: product_ids,
    });
    const updateDiscount = await updateDiscountByIdAndShopId(
      discountId,
      shopId,
      objectParams
    );
    return updateDiscount;
  };

  // get all product from discount code
  /**
    truong hop user da logged hay chua van co the xem duoc product 
    => field shopId co the co hoac khong
   */
  static getAllProductFromDiscountCode = async ({
    code,
    shopId,
    limit,
    page,
  }) => {
    // create index for discount code
    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      })
      .lean();

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount not exists");
    }

    let products;
    const { discount_applies_to, discount_product_ids } = foundDiscount;
    if (discount_applies_to === "all") {
      // get all product
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongodb(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    if (discount_applies_to === "specific") {
      // get the product ids
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    return products;
  };

  /*
    get all discount code from shop id
   */
  static getAllDiscountCodeFromShopId = async ({ shopId, limit, page }) => {
    // create index for discount code
    const discounts = await findAllDiscountCodeUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectIdMongodb(shopId),
        discount_is_active: true,
      },
      unSelect: ["__v", "discount_shopId"],
      model: discountModel,
    });

    return discounts;
  };

  /*
    get discount amount 

    carts [
      {
        productId,
        quantity,
        price
      },
      {
        productId,
        quantity,
        price
      }
    ]
   */
  static getDiscountAmount = async ({ code, shopId, carts }) => {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    });

    if (!foundDiscount) throw new NotFoundError(`Discount doesn't exist`);

    const {
      discount_min_order_value,
      discount_is_active,
      discount_max_uses,
      discount_type,
      discount_value,
    } = foundDiscount;

    if (!discount_is_active) throw new NotFoundError("Discount expired");
    if (!discount_max_uses) throw new NotFoundError("Discount are out");

    // nen su dung builder pattern
    if (
      DateValidation.isAfter(new Date(), discount_end_date) ||
      DateValidation.isSameOrAfter(discount_start_date, discount_end_date)
    ) {
      throw new BadRequestError("Discount code has expired!");
    }

    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = carts.reduce((acc, cart) => {
        return acc + cart.quantity * cart.price;
      }, 0);

      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(
          `Discount require min order value : ${discount_min_order_value}`
        );
      }
    }

    if (discount_max_uses_per_user > 0) {
      const userUsedDiscount = discount_users_used.find(
        (user) => user.userId === userId
      );

      if (userUsedDiscount) {
        throw new ForBiddenError("Every user only use one time");
      }
    }

    // check xem discount nay la fixed-amount hay all
    const amount =
      discount_type === DiscountType.FIXED_AMOUNT
        ? discount_value
        : discount_value / 100;

    return {
      discount: amount,
      totalOrder,
      totalPrice: totalOrder - amount,
    };
  };

  static deleteDiscountCode = async ({ code, shopId }) => {
    // improve later check discount dang duoc su dung o dau
    const deleted = await discountModel.findOneAndDelete({
      discount_code: code,
      discount_shopId: convertToObjectIdMongodb(shopId),
    });

    return deleted;
  };

  static cancelDiscountCode = async ({ code, shopId, userId }) => {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    });

    if (!foundDiscount) throw new NotFoundError(`Discount doesn't exist`);

    const result = await discountModel.findByIdAndDelete(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_used_count: -1,
      },
    });

    return result;
  };
}

module.exports = DiscountService;
