'use strict';

const { omit } = require('lodash');
const skuModel = require('../models/sku.model');
const { randomProductId } = require('../utils');

const newSku = async ({ spu_id, sku_list = [] }) => {
  try {
    const convert_sky_list = sku_list.map((sku) => ({
      ...sku,
      product_id: spu_id,
      sku_id: `${spu_id}.${randomProductId()}`,
    }));
    const newSkus = skuModel.create(convert_sky_list);
    return newSkus;
  } catch (error) {
    console.log('Error', error);
  }
};

const oneSku = async ({ sku_id, product_id }) => {
  try {
    // read cache
    const sku = await skuModel.findOne({ product_id, sku_id }).lean();

    console.log('sku', sku);

    if (!sku) {
      // set cached
    }

    return omit(sku, ['isDeleted', 'createdAt', 'updatedAt', '__v']);
  } catch (error) {
    console.log('Error', error);
  }
};

const allSkuBySpuId = async ({ product_id }) => {
  try {
    const skus = await skuModel.find({ product_id }).lean();

    return skus;
  } catch (error) {
    console.log('Error', error);
  }
};

module.exports = {
  newSku,
  oneSku,
  allSkuBySpuId,
};
