'use strict';

const { CACHE_PRODUCT } = require('../configs/constant');
const { getCacheIO } = require('../models/repositories/cache.repo');

const readCache = async (req, res, next) => {
  const skuCacheKey = `${CACHE_PRODUCT.SKU}${req.query.sku_id}`;

  let skuCache = await getCacheIO({ key: skuCacheKey });
  if (!skuCache) return next();

  return res.status(200).json({
    data: JSON.parse(skuCache),
    toLoad: 'cache middleware', // load from cache or dbs
  });
};

module.exports = {
  readCache,
};
