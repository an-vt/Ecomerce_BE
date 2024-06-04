"use strict";

const resourceModel = require("../models/resource.model");
const roleModel = require("../models/role.model");

class RBACService {
  /**
   * new resource
   * @param {string} name
   * @param {string} slug // dai dien cho cai name, nguoi ngoai ko hieu he thong se khong lam ro no la cai gi, chi team code hieu no
   * @param {string} description
   */
  static createResource = async ({
    name = "profile",
    slug = "p00001",
    description = "",
  }) => {
    try {
      // 1. check name or slug exists

      // 2. new resource
      const resource = await resourceModel.create({
        src_name: name,
        src_slug: slug,
        src_description: description,
      });

      return resource;
    } catch (error) {
      return error;
    }
  };

  static createRole = async ({
    name = "shop",
    slug = "s00001",
    description = "extend from shop or user",
    grants = [],
  }) => {
    try {
      // 1. check role exist ?
      // 2. new role
      const role = await roleModel.create({
        rol_name: name,
        rol_slug: slug,
        rol_description: description,
        rol_grants: grants,
      });

      return role;
    } catch (error) {
      return error;
    }
  };

  static resourceList = async ({
    userId = 0, //admin
    limit = 30,
    offset = 0,
    search = "",
  }) => {
    try {
      // 1. check admin ? middleware function

      // 2. get list of resource
      const resources = await resourceModel.aggregate([
        {
          $project: {
            _id: 0,
            name: "$src_name",
            slug: "$src_slug",
            description: "$src_description",
            resourceId: "$_id",
            createAt: 1,
          },
        },
      ]);

      return resources;
    } catch (error) {
      return [];
    }
  };

  static roleList = async ({
    userId = 0, //admin
    limit = 30,
    offset = 0,
    search = "",
  }) => {
    try {
      // 1. userId

      // 2. list roles
      // const roles = await roleModel.find();

      const roles = await roleModel.aggregate([
        {
          $unwind: "$rol_grants",
        },
        {
          $lookup: {
            from: "Resources",
            localField: "rol_grants.resource",
            foreignField: "_id",
            as: "resource",
          },
        },
        {
          $unwind: "$resource",
        },
        {
          $project: {
            role: "$rol_name",
            resource: "$resource.src_name",
            action: "$rol_grants.actions",
            attributes: "$rol_grants.attributes",
          },
        },
        {
          $unwind: "$action",
        },
        {
          $project: {
            _id: 0,
            role: 1,
            resource: 1,
            action: "$action",
            attributes: 1,
          },
        },
      ]);
      return roles;
    } catch (error) {
      return [];
    }
  };
}

module.exports = RBACService;
