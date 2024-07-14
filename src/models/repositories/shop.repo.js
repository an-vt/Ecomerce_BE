'use strict';

const { convertToObjectIdMongodb } = require('../../utils');
const shopModel = require('../shop.model');

const selectStruct = {
  email: 1,
  name: 1,
  status: 1,
  roles: 1,
};

const findShopById = async ({ shop_id, select = selectStruct }) => {
  return await shopModel
    .findById(convertToObjectIdMongodb(shop_id))
    .select(select)
    .lean();
};

module.exports = {
  findShopById,
};
