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
  return await inventory
    .findOne({
      inven_productId: convertToObjectIdMongodb(productId),
    })
    .lean();
};

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
      inven_productId: convertToObjectIdMongodb(productId),
      inven_stock: { $gte: quantity },
    },
    updateSet = {
      $inc: {
        inven_stock: -quantity,
      },
      $push: {
        inven_reservations: {
          quantity,
          cartId,
          createOn: new Date(),
        },
      },
    };
  return await inventory.updateOne(query, updateSet);
};

module.exports = {
  insertInventory,
  updateInventory,
  findInventoryByProductId,
  reservationInventory,
};
