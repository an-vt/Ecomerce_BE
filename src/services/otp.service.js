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

const checkEmailToken = async ({ token }) => {
  const otp = await otpModel.findOne({ otp_token: token });
  if (!otp) throw new Error("Token not found");

  await otpModel.deleteOne({ otp_token: token });
  return otp;
};

module.exports = {
  newOTP,
  checkEmailToken,
};
