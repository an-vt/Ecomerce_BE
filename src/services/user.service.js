"use strict";

const { ErrorResponse } = require("../core/error.response");
const userModel = require("../models/user.model");
const { sendEmailToken } = require("./email.service");
const { checkEmailToken } = require("./otp.service");
const bcrypt = require("bcrypt");
const { createUserRepo } = require("../models/repositories/user.repo");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData, convertToObjectIdMongodb } = require("../utils");
const crypto = require("node:crypto");
const {
  runProducerEmail,
} = require("../tests/message_queue/rabbitmq/providerDLXEmail.producer");

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
  static sendmail = async ({ email, captcha }) => {
    runProducerEmail().catch(console.error);
  };

  static checkLoginEmailTokenService = async ({ token }) => {
    const { otp_email: email } = await checkEmailToken({
      token,
    });

    if (!email) {
      throw new ErrorResponse("Token not found");
    }

    const hasUser = await UserService.findUserByEmailWithLogin({ email });

    if (hasUser) {
      throw new ErrorResponse("Email already exists");
    }

    // new user
    const passwordHash = await bcrypt.hash(email, 10);
    const newUser = await createUserRepo({
      usr_id: 1,
      usr_email: email,
      usr_password: passwordHash,
      usr_name: email,
      usr_slug: "X_Y",
      usr_role: "665e887415c538eaabddf385",
    });

    if (newUser) {
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");
      // Public key CtyptoGraphy Standards

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newUser.usr_id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        return {
          code: "xxxx",
          message: "keyStore error",
        };
      }

      // created token pair
      const tokens = await createTokenPair(
        { userId: newUser.usr_id, email },
        publicKey,
        privateKey
      );

      return {
        code: 201,
        metadata: {
          user: getInfoData({
            fields: ["usr_id", "usr_name", "usr_email"],
            object: newUser,
          }),
          tokens,
        },
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  };

  static findUserByEmailWithLogin = async ({ email }) => {
    const user = await userModel.findOne({ usr_email: email }).lean();

    return user;
  };
}

module.exports = UserService;
