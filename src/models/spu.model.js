'use strict';

const { Schema, model } = require('mongoose'); // Erase if already required
const slugify = require('slugify');
const DOCUMENT_NAME = 'Spu';
const COLLECTION_NAME = 'Spus';

// Declare the Schema of the Mongo model
var spuSchema = new Schema(
  {
    product_id: {
      // quan jean cao cap
      type: String,
      default: '',
    },
    product_name: {
      // quan jean cao cap
      type: String,
      required: true,
      unique: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
      required: true,
    },
    product_slug: String, // quan-jean-cao-cap
    product_price: {
      type: Number,
      required: true,
    },
    product_category: {
      type: Array,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    /*
      {
        attribute_id: 12345,
        attribute_values: [
          {
            value_id: 123
          }
        ]
      }
    */
    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be bellow 5.0'],
      // 4.3424 => 4.3
      set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: { type: Array, default: [] },
    /*
     tier_variation: [
      {
        images: [],
        name: 'color',
        options: ['red', 'blue', 'green'],
      },
      {
        images: [],
        name: 'size',
        options: ['S', 'M', 'L'],
      }
     ]
     */
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// create index for search
spuSchema.index({ product_name: 'text', product_description: 'text' });

// Document middleware: run before .save() and .create() ...
spuSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

//Export the model
module.exports = model(DOCUMENT_NAME, spuSchema);
