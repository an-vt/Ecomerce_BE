"use strict";

const { pick } = require("lodash");
const { Types } = require("mongoose");

const convertToObjectIdMongodb = (id) => new Types.ObjectId(id);

const getInfoData = ({ fields = [], object = {} }) => {
  return pick(object, fields);
};

// ['a', 'b'] => {'a': 1, 'b': 1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

// ['a', 'b'] => {'a': 0, 'b': 0}
const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

// remove attributes is null or undefined in both object and nested object
const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] === null || obj[k] === undefined) {
      delete obj[k];
    }
    if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      obj[k] = removeUndefinedObject(obj[k]);
    }
  });
  return obj;
};

const updateObjectNestedParse = (obj) => {
  const final = {};
  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      const response = updateObjectNestedParse(obj[k]);

      Object.keys(response).forEach((k2) => {
        final[`${k}.${k2}`] = response[k2];
      });
    } else {
      final[k] = obj[k];
    }
  });
  return final;
};

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
  updateObjectNestedParse,
  convertToObjectIdMongodb,
};
