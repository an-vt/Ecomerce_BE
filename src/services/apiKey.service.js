"use strict";

const apiKeyModal = require("../models/apiKey.modal");
const crypto = require("crypto");

const findById = async (key) => {
  const objKey = await apiKeyModal.findOne({ key, status: true }).lean();
  return objKey;
};

module.exports = {
  findById,
};
