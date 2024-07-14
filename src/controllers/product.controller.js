'use strict';
const { SuccessResponse } = require('../core/success.response');
const ProductServiceV2 = require('../services/product.service.xxx');
const { oneSku } = require('../services/sku.service');
const { newSpu, oneSpu } = require('../services/spu.service');

class ProductController {
  // start SPU, SKU
  findOneSpu = async (req, res, next) => {
    try {
      new SuccessResponse({
        message: 'Get one spu success',
        metadata: await oneSpu({ spu_id: req.query.product_id }),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  findOneSku = async (req, res, next) => {
    try {
      // const {sku_id, product_id} = req.query
      new SuccessResponse({
        message: 'Get one sku success',
        metadata: await oneSku(req.query),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  createSPU = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new spu success',
      metadata: await newSpu({
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  // end SPU, SKU
  createProduct = async (req, res, next) => {
    // new SuccessResponse({
    //   metadata: await ProductService.createProduct(req.body.product_type, {
    //     ...req.body,
    //     product_shop: req.user.userId
    //   }),
    // }).send(res);

    // V2
    new SuccessResponse({
      message: 'Create new Product success',
      metadata: await ProductServiceV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update Product success',
      metadata: await ProductServiceV2.updateProduct(
        req.body.product_type,
        req.params.productId,
        req.body.product_shop,
        {
          ...req.body,
          product_shop: req.user.userId,
        }
      ),
    }).send(res);
  };

  // QUERY
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list product draft success',
      metadata: await ProductServiceV2.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list product publish success',
      metadata: await ProductServiceV2.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  // END QUERY

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Publish product by shop success',
      metadata: await ProductServiceV2.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  unpublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Unpublish product by shop success',
      metadata: await ProductServiceV2.unpublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list product success',
      metadata: await ProductServiceV2.getListSearchProduct(req.params),
    }).send(res);
  };

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get all product success',
      metadata: await ProductServiceV2.findAllProduct(req.query),
    }).send(res);
  };

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get product detail success',
      metadata: await ProductServiceV2.findProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
