"use strict";
const { SuccessResponse } = require("../core/success.response");
const UserService = require("../services/user.service");

class UserController {
  // new user
  newUser = async (req, res, next) => {
    new SuccessResponse({
      message: "create new user success",
      metadata: await UserService.newUser(req.body),
    }).send(res);
  };
}

module.exports = new UserController();
