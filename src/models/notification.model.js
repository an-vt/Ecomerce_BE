"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "Notifications";

// ORDER-001: order successful
// ORDER-002: order fail
// PROMOTION-001: new promotion
// SHOP-001: new product by user following

// Declare the Schema of the Mongo model
var notificationSchema = new Schema(
  {
    noti_type: {
      type: String,
      enum: ["ORDER-001", "ORDER-002", "PROMOTION-001", "SHOP-001"],
      required: true,
    },
    noti_senderId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    noti_receiverId: {
      type: Number,
      required: true,
    },
    noti_content: {
      type: String,
      required: true,
    },
    // lưu trữ các trường hợp như: ban nhận được 1 vourcher của shop, lưu thông tin trong options, không cần phải join nữa
    noti_options: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, notificationSchema);
