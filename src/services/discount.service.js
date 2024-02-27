"use strict";

const { convertToObjectIdMongodb, removeUndefinedObject } = require("../utils");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const discountModel = require("../models/discount.model");
const { findAllProducts } = require("../models/repositories/product.repo");
const {
  findAllDiscountCodeUnSelect,
  updateDiscountByIdAndShopId,
} = require("../models/repositories/discount.repo");

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
    // if (new Date() > new Date(start_date) || new Date() > new Date(end_date)) {
    //   throw new BadRequestError("Discount code has expired!");
    // }

    // if (new Date(start_date) >= new Date(end_date)) {
    //   throw new BadRequestError("Start date must be greater end date");
    // }

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
    const { shopId, product_ids } = payload;

    if (!shopId) throw new BadRequestError("Invalid params");

    // if (new Date() > new Date(start_date) || new Date() > new Date(end_date)) {
    //   throw new BadRequestError("Discount code has expired!");
    // }

    // if (new Date(start_date) >= new Date(end_date)) {
    //   throw new BadRequestError("Start date must be greater end date");
    // }

    const objectParams = removeUndefinedObject({
      discount_product_ids: product_ids,
    });
    console.log({ objectParams });
    const updateDiscount = await updateDiscountByIdAndShopId(
      discountId,
      shopId,
      objectParams
    );
    console.log({ updateDiscount });
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
}

module.exports = DiscountService;
