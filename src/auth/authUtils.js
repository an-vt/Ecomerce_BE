"use strict";

const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESH_TOKEN: "x-rtoken-id",
};

const createTokenPair = async (payload, publicKey, privatekey) => {
  try {
    // accessToken
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privatekey, {
      expiresIn: "7 days",
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log("error verify::", err);
      } else {
        console.log("decode verify::", decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
  /*
    1 - Check userId missing ???
    2 - Get AT
    3 - Verify token
    4 - Check user in db
    5 - Check keyStore with this userId
    6 - Return next
  */

  // 1
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid request");
  // 2
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not found keyStore");

  // 3
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request");

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid userId");
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const authenticationV2 = asyncHandler(async (req, res, next) => {
  /*
    1 - Check userId missing ???
    2 - Get AT
    3 - Verify token
    4 - Check user in db
    5 - Check keyStore with this userId
    6 - Return next
  */

  // 1
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid request");
  // 2
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not found keyStore");

  // 3
  if (req.headers[HEADER.REFRESH_TOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.userId)
        throw new AuthFailureError("Invalid userId");
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid userId");
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authentication,
  authenticationV2,
  verifyJWT,
};
