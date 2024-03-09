"use strict";

const { convertToObjectIdMongodb } = require("../../utils");
const inventory = require("../inventory.model");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unknown",
}) => {
  return await inventory.create({
    inven_productId: productId,
    inven_location: location,
    inven_stock: stock,
    inven_shopId: shopId,
  });
};

const updateInventory = async ({
  productId,
  shopId,
  bodyUpdate = {},
  isNew = true,
}) => {
  return await inventory.findOneAndUpdate(
    {
      inven_productId: convertToObjectIdMongodb(productId),
      inven_shopId: convertToObjectIdMongodb(shopId),
    },
    bodyUpdate,
    {
      new: isNew,
    }
  );
};

const findInventoryByProductId = async (productId) => {
  return await inventory.findById(productId).lean();
};

module.exports = {
  insertInventory,
  updateInventory,
  findInventoryByProductId,
};
