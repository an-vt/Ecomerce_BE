'use strict';

const express = require('express');
const productController = require('../../controllers/product.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');
const { readCache } = require('../../middlewares/readCache.middleware');
const router = express.Router();

// search in here because user not authenticate still can search
router.get(
  '/search/:keySearch',
  asyncHandler(productController.getListSearchProduct)
);
router.get('', asyncHandler(productController.findAllProducts));
router.get(
  '/sku/select_variation',
  readCache,
  asyncHandler(productController.findOneSku)
);
router.get('/spu/get_spu_info', asyncHandler(productController.findOneSpu));
router.get('/:product_id', asyncHandler(productController.findProduct));

// authentication before logout
router.use(authenticationV2);

router.post('', asyncHandler(productController.createProduct));
router.post('/spu/new', asyncHandler(productController.createSPU));
router.patch('/:productId', asyncHandler(productController.updateProduct));
router.post(
  '/publish/:id',
  asyncHandler(productController.publishProductByShop)
);
router.post(
  '/unpublish/:id',
  asyncHandler(productController.unpublishProductByShop)
);

// Query
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop));
router.get(
  '/published/all',
  asyncHandler(productController.getAllPublishForShop)
);

module.exports = router;
