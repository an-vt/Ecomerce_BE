"use strict";
const { CREATED, SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");
const ProductServiceV2 = require("../services/product.service.xxx");

class ProductController {
  createProduct = async (req, res, next) => {
    // new SuccessResponse({
    //   metadata: await ProductService.createProduct(req.body.product_type, {
    //     ...req.body,
    //     product_shop: req.user.userId
    //   }),
    // }).send(res);

    // V2
    new SuccessResponse({
      message: "Create new Product success",
      metadata: await ProductServiceV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  // QUERY
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list product draft success",
      metadata: await ProductServiceV2.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list product publish success",
      metadata: await ProductServiceV2.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  // END QUERY

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Publish product by shop success",
      metadata: await ProductServiceV2.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  }

  unpublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Unpublish product by shop success",
      metadata: await ProductServiceV2.unpublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  }

  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list product success",
      metadata: await ProductServiceV2.getListSearchProduct(req.params),
    }).send(res);
  }
}

module.exports = new ProductController();
