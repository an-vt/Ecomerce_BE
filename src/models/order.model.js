"use strict";

const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

const OrderStatus = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  SHIPPED: "shipped",
  CANCELED: "canceled",
  DELIVERED: "delivered",
};

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
    order_userId: { type: Number, require: true },
    /**
     * order_checkout = {
     *  totalPrice,
     *  totalApplyDiscount,
     *  feeShip
     * }
     */
    order_checkout: { type: Object, default: {} },
    order_shipping: { type: Object, default: {} },
    order_payment: { type: Object, default: {} },
    order_trackingNumber: { type: Object, default: `#000110032024` },
    order_status: {
      type: String,
      enum: [
        OrderStatus.CANCELED,
        OrderStatus.CONFIRMED,
        OrderStatus.DELIVERED,
        OrderStatus.PENDING,
        OrderStatus.SHIPPED,
      ],
      default: OrderStatus.PENDING,
    },
    order_products: {
      type: Array,
      required: true,
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: "createdOn",
      updatedAt: "modifiedOn",
    },
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, orderSchema);
