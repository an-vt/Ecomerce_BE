'use strict';

const { omit } = require('lodash');
const { NotFoundError } = require('../core/error.response');
const { findShopById } = require('../models/repositories/shop.repo');
const spuModel = require('../models/spu.model');
const { randomProductId } = require('../utils');
const { newSku, allSkuBySpuId } = require('./sku.service');

const newSpu = async ({
  product_name,
  product_thumb,
  product_description,
  product_price,
  product_category,
  product_quantity,
  product_shop,
  product_attributes,
  product_ratingsAverage,
  product_variations,
  sku_list = [],
}) => {
  try {
    // 1. check if shop exists
    const foundShop = await findShopById({ shop_id: product_shop });
    if (!foundShop) {
      throw new NotFoundError('Shop not found');
    }

    // 2. create new Spu
    const newSpu = await spuModel.create({
      product_id: randomProductId(),
      product_name,
      product_thumb,
      product_description,
      product_price,
      product_category,
      product_quantity,
      product_shop,
      product_attributes,
      product_ratingsAverage,
      product_variations,
      sku_list,
    });

    // 3. create new Sku
    if (newSpu && sku_list.length > 0) {
      await newSku({ spu_id: newSpu.product_id, sku_list });
    }

    // 4. sync data via elastic search

    // 5. return new Spu
    return newSpu;
  } catch (error) {
    console.log('Error', error);
  }
};

const oneSpu = async ({ spu_id }) => {
  try {
    const spu = await spuModel
      .findOne({ product_id: spu_id, isPublished: false })
      .lean();
    if (!spu) {
      throw new NotFoundError('Spu not found');
    }
    const skus = await allSkuBySpuId({ product_id: spu.product_id });
    console.log('3333', skus);

    return {
      spu_info: omit(spu, ['isDeleted', 'createdAt', 'updatedAt', '__v']),
      sku_list: skus.map((sku) =>
        omit(sku, ['isDeleted', 'createdAt', 'updatedAt', '__v'])
      ),
    };
  } catch (error) {
    return {};
  }
};

module.exports = {
  newSpu,
  oneSpu,
};
