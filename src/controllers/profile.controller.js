"use strict";

const { SuccessResponse } = require("../core/success.response");

const dataProfiles = [
  {
    usr_id: 1,
    usr_name: "CR7",
    usr_id: "image/user/1",
  },
  {
    usr_id: 2,
    usr_name: "M10",
    usr_id: "image/user/2",
  },
  {
    usr_id: 3,
    usr_name: "Michael",
    usr_id: "image/user/3",
  },
];

class ProfileController {
  profiles = async (req, res, next) => {
    new SuccessResponse({
      message: "View all profiles success",
      metadata: dataProfiles,
    }).send(res);
  };

  profile = async (req, res, next) => {
    new SuccessResponse({
      message: "View all profile success",
      metadata: {
        usr_id: 1,
        usr_name: "CR7",
        usr_id: "image/user/1",
      },
    }).send(res);
  };
}

module.exports = new ProfileController();
