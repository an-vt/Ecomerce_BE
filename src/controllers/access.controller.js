"use strict";
const { CREATED } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessControler {
  signUp = async (req, res, next) => {
    new CREATED({
      message: "Register OK",
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 1000,
      },
    }).send(res);
  };
}

module.exports = new AccessControler();
