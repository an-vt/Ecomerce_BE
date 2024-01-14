"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const KeyTokenService = require("./keyToken.service");
const { log } = require("console");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  ForBiddenError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  /*
    1 - check email in db
    2 - match password
    3 - create accessToken vs refreshToken and save
    4 - generate token
    5 - get data return login
  */

  static login = async ({ email, password, refreshToken = null }) => {
    // 1.
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop not registered");

    // 2.
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Authentication error");

    // 3.
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    // 4.
    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    // 5.
    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // try {
    // step1: check email exists

    // return object js, more faster only findOne because findOne return so much information about mongo connection
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Error: Shop already registered");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      // created privateKey and publicKey
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // });
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");
      // Public key CtyptoGraphy Standards

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        return {
          code: "xxxx",
          message: "keyStore error",
        };
      }

      // created token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }

    return {
      code: 200,
      metadata: null,
    };
    // } catch (error) {
    //   return {
    //     code: "xxx",
    //     message: error.message,
    //     status: "error",
    //   };
    // }
  };

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return delKey;
  };

  /*
    Check token used ? 
    V1
  */
  // static handleRefetchToken = async (refreshToken) => {
  //   //check token duoc su dung chua
  //   const foundToken = await KeyTokenService.findByRefreshTokenUsed(
  //     refreshToken
  //   );
  //   console.log("foundToken", foundToken);
  //   // found token cho vao blacklist
  //   if (foundToken) {
  //     // decode xem la thang nao ?
  //     const { userId, email } = await verifyJWT(
  //       refreshToken,
  //       foundToken.privateKey
  //     );

  //     console.log({ userId, email });
  //     // xoa tat ca token trong keyStore(token khong con han su dung, log out tat ca cac user)
  //     await KeyTokenService.deleteById(userId);

  //     throw new ForBiddenError("Something wrong happend. Please re-login");
  //   }

  //   // tim kiem la cac refresh token trong db co dung la dang duoc su dung hay khong
  //   const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);

  //   if (!holderToken) throw new AuthFailureError("Shop not registered");

  //   //verify token
  //   const { userId, email } = await verifyJWT(
  //     refreshToken,
  //     holderToken.privateKey
  //   );

  //   //check userId
  //   const foundShop = await findByEmail({ email });
  //   if (!foundShop) throw new AuthFailureError("Shop not registered");

  //   // 1. Dua cai refresh token nay vao danh sach RT da duoc su dung
  //   // 2. cap lai cap AT & RT
  //   const tokens = await createTokenPair(
  //     { userId: foundShop._id, email },
  //     holderToken.publicKey,
  //     holderToken.privateKey
  //   );

  //   //update token
  //   await holderToken.updateOne({
  //     $set: {
  //       refreshToken: tokens.refreshToken,
  //     },
  //     $addToSet: {
  //       refreshTokensUsed: refreshToken, //da duoc su dung de lay token moi roi
  //     },
  //   });

  //   return {
  //     user: { userId, email },
  //     tokens,
  //   };
  // };

  // v2 fixed
  static handleRefetchTokenV2 = async ({ refreshToken, user, keyStore }) => {
    const { userId, email } = user;

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      // xoa tat ca token trong keyStore(token khong con han su dung, log out tat ca cac user)
      await KeyTokenService.deleteById(userId);

      throw new ForBiddenError("Something wrong happend. Please re-login");
    }

    if (keyStore.refreshToken !== refreshToken)
      throw new AuthFailureError("Shop not registered");

    //check userId
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not registered");

    // 1. Dua cai refresh token nay vao danh sach RT da duoc su dung
    // 2. cap lai cap AT & RT
    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );

    //update token
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken, //da duoc su dung de lay token moi roi
      },
    });

    return {
      user,
      tokens,
    };
  };
}

module.exports = AccessService;
