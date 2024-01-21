"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { log } = require("console");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.model");
const { findAllDraftsForShop, publishProductByShop, findAllPublishForShop, unpublishProductByShop, searchProductByUser, findAllProducts, findProduct } = require("../models/repositories/product.repo");

// define Factory class to create product
class ProductFactory {
  /**
   * type: 'Clothing' | 'Electronics'
   */

  static ProductRegistry = {}; // key - class

  static registerProductType(type, classRef) {
    ProductFactory.ProductRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.ProductRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid Product Type: ${type}`);

    return new productClass(payload).createProduct();
  }

  static async updateProduct({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  // QUERY
  /**
   * @description get all drafts for shop
   * @param {ObjectId} product_shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, skip, limit });
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishForShop({ query, skip, limit });
  }
  // END QUERY

  // PUT
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unpublishProductByShop({ product_shop, product_id }) {
    return await unpublishProductByShop({ product_shop, product_id });
  }

  static async getListSearchProduct({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProduct({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
    return await findAllProducts({ limit, sort, page, filter, select: ["product_name", "product_price", "product_thumb"] });
  }

  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unSelect: ['__v'] });
  }
  // END PUT
}

// define base  Factory class to create product
class Product {
  constructor({
    product_name,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_thumb,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_thumb = product_thumb;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  // create new product
  async createProduct(product_id) {
    return await product.create({ ...this, _id: product_id });
  }
}

// Define sub-class for different product types Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("create new Clothing error");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("create new Product error");

    return newProduct;
  }
}

// Define sub-class for different product types Electronics
class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError("create new Electronics error");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("create new Product error");

    return newProduct;
  }
}

// Define sub-class for different product types Furniture
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError("create new Furniture error");

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError("create new Product error");

    return newProduct;
  }
}

// register product types
ProductFactory.registerProductType("Electronic", Electronics);
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;
