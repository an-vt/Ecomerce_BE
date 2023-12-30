"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

// Declare the Schema of the Mongo model
var productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
      unique: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: String,
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: Number,
      required: true,
      enum: ["Electronics", "Closing", "Furniture"],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    product_attributes: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// define the product type = clothing

var clothingSchema = new Schema(
  {
    branch: { type: String, required: true },
    size: String,
    material: String,
  },
  {
    timestamps: true,
    collection: "clothes",
  }
);

// define the product type = electronic

var electronicSchema = new Schema(
  {
    manufacturing: { type: String, required: true },
    size: String,
    material: String,
  },
  {
    timestamps: true,
    collection: "electronics",
  }
);

//Export the model
module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothes: model("Clothing", clothingSchema),
  electronics: model("Electronic", electronicSchema),
};
