const rbac = require("./role.middleware");
const { AuthFailureError } = require("../core/error.response");
const { roleList } = require("../services/rbac.service");

/**
 * @param {string} action // read, update or delete
 * @param {*} resource // profile, balance, ...
 */
const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      rbac.setGrants(
        await roleList({
          userId: 9999,
        })
      );
      const rol_name = req.query.role;
      const abcd1 = rbac.can(rol_name);
      const abcd2 = rbac.can(rol_name)[action];

      const permission = rbac.can(rol_name)[action](resource);
      if (!permission.granted) {
        throw new AuthFailureError("You don't have enough permission...");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  grantAccess,
};
