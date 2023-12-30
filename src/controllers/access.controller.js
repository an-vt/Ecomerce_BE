"use strict";
const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessControler {
  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body),
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
    new SuccessResponse({
      message: "Logout success",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  handleRefreshToken = async (req, res, next) => {
    // V1
    // new SuccessResponse({
    //   message: "Get token success",
    //   metadata: await AccessService.handleRefetchToken(req.body.refreshToken),
    // }).send(res);

    // V2 fixed, no need accessToken
    new SuccessResponse({
      message: "Get token success",
      metadata: await AccessService.handleRefetchTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };
}

module.exports = new AccessControler();
