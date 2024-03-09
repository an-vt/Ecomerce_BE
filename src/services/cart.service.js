"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const KeyTokenService = require("./keyToken.service");
const { log } = require("console");
const { getInfoData, convertToObjectIdMongodb } = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  ForBiddenError,
  NotFoundError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const cartModel = require("../models/cart.model");
const { getProductById } = require("../models/repositories/product.repo");
const {
  findInventoryByProductId,
} = require("../models/repositories/inventory.repo");

/**
 * Key feature
 * 1. add to cart [User]
 * 2. reduce product quantity by one [User]
 * 3. increase product quantity by one [User]
 * 4. get cart [User]
 * 5. delete cart [User]
 * 6. delete cart item [User]
 */

class CartService {
  static createUserCart = async ({ userId, product }) => {
    const query = { cart_userId: userId, cart_state: "active" },
      updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
        cart_count_product: 1,
      },
      options = { upsert: true, new: true };

    return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
  };

  static updateUserCartQuantity = async ({ userId, product }) => {
    const { productId, quantity } = product;
    const query = {
        cart_userId: userId,
        "cart_products.productId": convertToObjectIdMongodb(productId),
        cart_state: "active",
      },
      updateSet = {
        $inc: {
          "cart_products.$.quantity": quantity,
        },
      },
      options = { upsert: true, new: true };

    return await cartModel.findOneAndUpdate(query, updateSet, options);
  };

  static addToCart = async ({ userId, product = {} }) => {
    if (!userId) throw new BadRequestError("Missing userId");

    const { _id, product_price, product_name } = await getProductById(
      product?.productId
    );

    // kiem tra inventory, neu khong du so luong hang tra ve error
    const inventoryProduct = await findInventoryByProductId(product?.productId);

    if (inventoryProduct.inven_stock < product.quantity)
      throw new ForBiddenError(
        "Inventory product don't enough quantity. Please try again"
      );

    const productCart = {
      productId: _id,
      shopId: product?.shopId,
      quantity: product.quantity,
      price: product_price,
      name: product_name,
    };

    // check cart co ton tai hay khong
    const userCart = await cartModel.findOne({ cart_userId: userId });

    if (!userCart) {
      // create cart for user
      return await CartService.createUserCart({ userId, product: productCart });
    }

    // neu cos gio hang roi nhung chua co san pham
    if (!userCart?.cart_products?.length) {
      userCart.cart_products = [productCart];
      return await userCart.save();
    }

    // check productId exist hay khong
    const existingProduct = userCart.cart_products.find((product) => {
      return product.productId.toString() === productCart.productId.toString();
    });

    // them 1 san pham moi vao gio hang
    if (!existingProduct) {
      userCart.cart_products.push(productCart);
      userCart.cart_count_product = userCart.cart_products.length;
      return await userCart.save();
    }

    // gio hang ton tai co san pham thi update quantity productCart
    return await CartService.updateUserCartQuantity({
      userId,
      product: productCart,
    });
  };

  /**
   * Update cart
    shop_order_ids: [
      {
        shopId,
        item_products: {
          quantity,
          price,
          shopId,
          old_quantity,
          productId
        }
      }
    ],
    version
   */
  static addToCartV2 = async (payload = {}) => {
    const { shop_order_ids, userId } = payload;
    const { productId, quantity, old_quantity } =
      shop_order_ids?.[0]?.item_products?.[0];

    // check product
    const foundProduct = await getProductById(productId);
    if (!foundProduct) throw new NotFoundError(`Product doesn't exist`);

    //compare product shop
    if (foundProduct.product_shop.toString() !== shop_order_ids?.[0]?.shopId)
      throw new NotFoundError(`Product doesn't belong to the shop`);

    // kiem tra inventory, neu khong du so luong hang tra ve error
    const inventoryProduct = await findInventoryByProductId(productId);
    if (inventoryProduct.inven_stock < quantity)
      throw new ForBiddenError(
        "Inventory product don't enough quantity. Please try again"
      );

    // xoa san pham
    if (quantity === 0) {
      // deleted
    }

    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  };

  static deleteUserCart = async ({ userId, productId }) => {
    const query = { cart_userId: userId, cart_state: "active" },
      updateSet = {
        $pull: {
          cart_products: {
            productId,
          },
        },
      };
    const deleteCart = await cartModel.updateOne(query, updateSet);

    return deleteCart;
  };

  static getListUserCart = async ({ userId }) => {
    return await cartModel
      .findOne({
        cart_userId: +userId,
      })
      .lean();
  };
}

module.exports = CartService;
