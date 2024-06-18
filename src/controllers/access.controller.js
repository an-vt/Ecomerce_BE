"use strict";
const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

function setCookie(res, refreshToken, expires = 3 * 24 * 60 * 60 * 10) {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // Makes the cookie inaccessible to client-side JS
    maxAge: expires,
    path: "/v1/api/shop/handleRefreshToken",
    secure: false,
  });
}

class AccessControler {
  login = async (req, res, next) => {
    const metadata = await AccessService.login(req.body);
    setCookie(res, metadata.tokens.refreshToken);
    new SuccessResponse({
      metadata,
    }).send(res);
  };

  signUp = async (req, res, next) => {
    new CREATED({
      message: "Register OK",
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 1000,
      },
    }).send(res);
  };

  logout = async (req, res, next) => {
    const metadata = await AccessService.logout(req.keyStore);
    setCookie(res, metadata.tokens.refreshToken, new Date(0));
    new SuccessResponse({
      message: "Logout success",
      metadata,
    }).send(res);
  };

  handleRefreshToken = async (req, res, next) => {
    // V1
    // new SuccessResponse({
    //   message: "Get token success",
    //   metadata: await AccessService.handleRefetchToken(req.body.refreshToken),
    // }).send(res);
    const refreshToken = req.cookies?.["refreshToken"];
    // V2 fixed, no need accessToken

    const metadata = await AccessService.handleRefetchTokenV2({
      refreshToken,
      user: req.user,
      keyStore: req.keyStore,
    });

    setCookie(res, metadata.tokens.refreshToken);

    new SuccessResponse({
      message: "Get token success",
      metadata: metadata,
    }).send(res);
  };
}

module.exports = new AccessControler();
