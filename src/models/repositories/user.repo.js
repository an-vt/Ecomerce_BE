"use strict";

const userModel = require("../user.model");

const createUserRepo = async ({
  usr_id,
  usr_email,
  usr_password,
  usr_name,
  usr_slug,
  usr_role,
}) => {
  return await userModel.create({
    usr_id,
    usr_email,
    usr_password,
    usr_name,
    usr_slug,
    usr_role,
  });
};

module.exports = {
  createUserRepo,
};
