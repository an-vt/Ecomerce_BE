"use strict";

const { BadRequestError } = require("../core/error.response");
const orderModel = require("../models/order.model");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");

class CheckoutService {
  /**
    {
      cartId,
      userId,
      shop_order_ids: [
        {
          shopId,
          shop_discounts: [
            {
              shopId,
              discountId,
              codeId
            }
          ],
          item_products: [
            {
              price,
              quantity,
              productId
            }
          ]
        }
      ]
    }
   */
  static checkoutReview = async ({ cartId, userId, shop_order_ids }) => {
    // check cart co exist hay khong
    const foundCart = findCartById(cartId);
    if (!foundCart) throw new BadRequestError("Cart does not exists");

    const checkout_order = {
        totalPrice: 0,
        feeShip: 0,
        totalDiscount: 0,
        totalCheckout: 0,
      },
      shop_order_ids_new = [];

    // tinh tong tien bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];
      // check product available
      const checkProductServers = await checkProductByServer(item_products);

      if (!checkProductServers[0]) throw new BadRequestError("Order wrong !");

      // tong tien don hang
      const checkoutPrice = checkProductServers.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      // tong tien truoc khi xu ly
      checkout_order.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServers,
      };

      // neu shop_discounts ton tai >= 0, check xem co hop le hay khong
      if (shop_discounts.length > 0) {
        // gia su chi co 1 discount
        // get amount discount
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          code: shop_discounts[0].codeId,
          shopId,
          carts: checkProductServers,
          userId,
        });

        // tong cong discount giam gia
        checkout_order.totalDiscount += discount;

        // neu tien giam gia lon hon 0
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      // tong thanh toan cuoi cung
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  };

  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) {
    const { shop_order_ids: shop_order_ids_new, checkout_order } =
      CheckoutService.checkoutReview({ shop_order_ids, cartId, userId });

    // check lai mot lan nua xem co vuot ton kho hay khong
    // get new array products
    const products = shop_order_ids_new.flatMap((order) => order.item_products);
    console.log(`[1] ::: ${products}`);
    const acquireProduct = [];
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireProduct.push(keyLock ? true : false);

      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    if (acquireProduct.includes(false)) {
      throw new BadRequestError(
        "A few product had just update. Please checkout cart again!"
      );
    }

    const newOrder = await orderModel.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: userId,
      order_products: shop_order_ids_new,
    });

    // truong hop: new insert thanh cong, thi remove product co trong cart
    if (newOrder) {
      // remove product in cart
    }

    return newOrder;
  }
}

module.exports = CheckoutService;
