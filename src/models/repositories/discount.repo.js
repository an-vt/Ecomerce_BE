"use strict";

const { unGetSelectData, convertToObjectIdMongodb } = require("../../utils");
const { discountModel } = require("../discount.model");

const findAllDiscountCodeUnSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  unSelect,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean();

  return products;
};

const findAllDiscountCodeSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(select))
    .lean();

  return products;
};

const updateDiscountByIdAndShopId = async (
  discountId,
  shopId,
  bodyUpdate,
  isNew = true
) => {
  return await discountModel.findOneAndUpdate(
    {
      _id: convertToObjectIdMongodb(discountId),
      discount_shopId: convertToObjectIdMongodb(shopId),
    },
    bodyUpdate,
    {
      new: isNew,
    }
  );
};

const checkDiscountExists = async ({ model, filter }) => {
  return await model.findOne(filter).lean();
};

module.exports = {
  findAllDiscountCodeUnSelect,
  findAllDiscountCodeSelect,
  updateDiscountByIdAndShopId,
  checkDiscountExists,
};
