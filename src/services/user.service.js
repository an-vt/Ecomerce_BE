"use strict";

const { ErrorResponse } = require("../core/error.response");
const userModel = require("../models/user.model");
const { sendEmailToken } = require("./email.service");

class UserService {
  static newUser = async ({ email, captcha }) => {
    //1. check email exists
    const user = await userModel.findOne({ usr_email: email }).lean();

    //2. if user exists, throw error
    if (user) {
      throw new ErrorResponse("Email already exists");
    }

    //3. send token via email user
    const result = await sendEmailToken({ email });

    return result;
  };
}

module.exports = UserService;
