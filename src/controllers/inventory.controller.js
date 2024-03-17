"use strict";

const InventoryService = require("../services/inventory.service");

class InventoryController {
  addStockToInventory = async (req, res, next) => {
    new SuccessResponse({
      message: "Add stock to inventory success",
      metadata: await InventoryService.addStockToInventory({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new InventoryController();
