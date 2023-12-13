"use strict";
const AccessService = require("../services/access.service");

class AccessControler {
  signUp = async (req, res, next) => {
    return res.status(201).json(await AccessService.signUp(req.body));
  };
}

module.exports = new AccessControler();
