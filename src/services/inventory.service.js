"use strict";

const { BadRequestError } = require("../core/error.response");
const { getProductById } = require("../models/repositories/product.repo");
const inventoryModel = require("../models/inventory.model");

/**
 * Key feature
 * 1. add to cart [User]
 * 2. reduce product quantity by one [User]
 * 3. increase product quantity by one [User]
 * 4. get cart [User]
 * 5. delete cart [User]
 * 6. delete cart item [User]
 */

class InventoryService {
  static addStockToInventory = async ({
    stock,
    productId,
    shopId,
    location = "98 Vu Trong Phung",
  }) => {
    const product = await getProductById(productId);
    if (!product) throw new BadRequestError(`The product doesn't exists`);
    const query = { inven_shopId: shopId, inven_productId: productId },
      updateOrInsert = {
        $inc: {
          inven_stock: stock,
        },
        $set: {
          inven_location: location,
        },
      },
      options = { upsert: true, new: true };

    return await inventoryModel.findOneAndUpdate(
      query,
      updateOrInsert,
      options
    );
  };
}

module.exports = InventoryService;
