"use strict";

const { NotFoundError } = require("../core/error.response");
const Comment = require("../models/comment.model");
const notificationModel = require("../models/notification.model");
const { convertToObjectIdMongodb } = require("../utils");
const ProductServiceV2 = require("./product.service.xxx");

/**
 * Key feature
 * 1. add comment [User | Shop]
 * 2. get list of comments [User | Shop]
 * 3. delete a comment [User | Shop | Admin]
 */

class NotificationService {
  static createComment = async ({
    type = "SHOP-001",
    receiverId = 1,
    senderId = 1,
    options = {},
  }) => {
    let content;

    if (type === "SHOP-001") {
      content = `@@@ vua them 1 san pham: @@@`;
    }
    if (type === "PROMOTION-001") {
      content = `@@@ vua them 1 san vourcher: @@@`;
    }

    const newNoti = await notificationModel.create({
      noti_type: type,
      noti_senderId: senderId,
      noti_receiverId: receiverId,
      noti_content: content,
      noti_options: options,
    });

    return newNoti;
  };

  static listNotiByUser = async ({ type = "ALL", userId = 1, isRead = 0 }) => {
    const match = { noti_receiverId: userId };
    if (type !== "ALL") {
      match["noti_type"] = type;
    }

    return await notificationModel.aggregate([
      {
        $match: match,
      },
      {
        $project: {
          noti_type: 1,
          noti_senderId: 1,
          noti_receiverId: 1,
          noti_content: 1,
          createAt: 1,
          noti_options: 1,
        },
      },
    ]);
  };
}

module.exports = NotificationService;
