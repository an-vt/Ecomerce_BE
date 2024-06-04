"use strict";

const { SuccessResponse } = require("../core/success.response");
const {
  createResource,
  createRole,
  roleList,
  resourceList,
} = require("../services/rbac.service");

const newRole = async (req, res, next) => {
  new SuccessResponse({
    message: "created role",
    metadata: await createRole(req.body),
  }).send(res);
};

const newResource = async (req, res, next) => {
  new SuccessResponse({
    message: "created resource",
    metadata: await createResource(req.body),
  }).send(res);
};

const listRole = async (req, res, next) => {
  new SuccessResponse({
    message: "list role",
    metadata: await roleList(req.query),
  }).send(res);
};

const listResource = async (req, res, next) => {
  new SuccessResponse({
    message: "list resource",
    metadata: await resourceList(req.query),
  }).send(res);
};

module.exports = {
  newRole,
  newResource,
  listRole,
  listResource,
};
