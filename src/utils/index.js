"use strict";

const { pick } = require("lodash");

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

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] === null || obj[k] === undefined) {
      delete obj[k];
    }
  });
  return obj;
};

const updateObjectNestedParse = (obj) => {
  const final = {};
  console.log("[1] :::", obj);
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
  console.log("[2] :::", final);
  return final;
};

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
  updateObjectNestedParse,
};
