"use strict";

const templateModel = require("../models/template.model");
const { htmlEmailToken } = require("../utils/template.html");

const newTemplate = async ({ tem_name, tem_id }) => {
  const newTemplate = await templateModel.create({
    tem_name: tem_name,
    tem_html: htmlEmailToken(),
    tem_id,
  });
  return newTemplate;
};

const getTemplate = async ({ tem_name }) => {
  const template = await templateModel.findOne({
    tem_name: tem_name,
  });
  return template;
};

module.exports = {
  newTemplate,
  getTemplate,
};
