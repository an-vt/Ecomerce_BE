"use strict";

const JWT = require("jsonwebtoken");

const createTokenPair = async (payload, publicKey, privatekey) => {
  try {
    // accessToken
    const accessToken = await JWT.sign(payload, privatekey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privatekey, {
      algorithm: "RS256",
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

module.exports = {
  createTokenPair,
};
