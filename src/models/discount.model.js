"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

const DiscountType = {
  FIXED_AMOUNT: "fixed_amount",
  PERCENT: "percent",
};

// Declare the Schema of the Mongo model
var discountSchema = new Schema(
  {
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: {
      type: String,
      default: "fixed_amount",
      required: true,
      enum: ["fixed_amount", "percent"],
    }, // giam gia theo percent or amount
    discount_value: { type: Number, required: true }, // gia tri giam gia 10% or 10.000
    discount_code: { type: String, required: true }, // code
    discount_start_date: { type: Date, required: true }, // ngay bat dau
    discount_end_date: { type: Date, required: true }, // ngay ket thuc
    discount_max_uses: { type: Number, required: true }, // toi da so luot su dung
    discount_used_count: { type: Number, required: false, default: 0 }, // so luong da su dung
    discount_users_used: { type: Array, default: [] }, // user nao su dung
    discount_max_uses_per_user: { type: Number, required: true }, // so luong luot su dung cua 1 user
    discount_min_order_value: { type: Number, required: true }, // min order value se duoc apply voucher
    discount_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: {
      type: String,
      required: true,
      enum: ["all", "specific"],
    },
    discount_product_ids: { type: Array, default: [] },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = {
  discountModel: model(DOCUMENT_NAME, discountSchema),
  DiscountType,
};
