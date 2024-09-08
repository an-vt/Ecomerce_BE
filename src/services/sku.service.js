'use strict';

const { omit } = require('lodash');
const skuModel = require('../models/sku.model');
const { randomProductId } = require('../utils');
const { CACHE_PRODUCT } = require('../configs/constant');
const {
  getCacheIO,
  setCacheIOExpiration,
} = require('../models/repositories/cache.repo');

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
    // 1. Check params
    if (sku_id < 0 || product_id < 0) return null;

    const skuCacheKey = `${CACHE_PRODUCT.SKU}${sku_id}`;

    // 3. Read from dbs
    const skuCache = await skuModel.findOne({ product_id, sku_id }).lean();
    const valueCache = skuCache ? skuCache : null;
    setCacheIOExpiration({
      key: skuCacheKey,
      value: JSON.stringify(valueCache),
      expirationInSeconds: 30, // 30 seconds
    }).then();

    return {
      data: skuCache,
      toLoad: 'dbs',
    };
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
