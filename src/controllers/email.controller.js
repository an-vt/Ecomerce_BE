"use strict";
const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");
const { newTemplate } = require("../services/template.service");

class EmailController {
  // new user
  newTemplate = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new template",
      metadata: await newTemplate(req.body),
    }).send(res);
  };
}

module.exports = new EmailController();
