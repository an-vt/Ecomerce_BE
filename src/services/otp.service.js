"use strict";

const { NotFoundError } = require("../core/error.response");
const otpModel = require("../models/otp.model");
const crypto = require("crypto");

const generatorTokenRandom = () => {
  return crypto.randomInt(0, Math.pow(2, 32));
};

const newOTP = async ({ email }) => {
  const token = generatorTokenRandom();
  const newToken = await otpModel.create({
    otp_token: token,
    otp_email: email,
  });
  return newToken;
};

module.exports = {
  newOTP,
};
