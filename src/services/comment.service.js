"use strict";

const { NotFoundError } = require("../core/error.response");
const Comment = require("../models/comment.model");
const { convertToObjectIdMongodb } = require("../utils");
const ProductServiceV2 = require("../services/product.service.xxx");

/**
 * Key feature
 * 1. add comment [User | Shop]
 * 2. get list of comments [User | Shop]
 * 3. delete a comment [User | Shop | Admin]
 */

class CommentService {
  static createComment = async ({
    productId,
    userId,
    content,
    parentCommentId,
  }) => {
    if (
      !(await ProductServiceV2.checkProductExist({
        product_id: productId,
      }))
    )
      throw new NotFoundError("Not found comment for product");
    const comment = new Comment({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId,
    });
    let rightValue;
    if (parentCommentId) {
      // rely comment
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) throw new NotFoundError("Parent comment not found");

      rightValue = parentComment.comment_right;

      // update many comment_right
      await Comment.updateMany(
        {
          comment_productId: convertToObjectIdMongodb(productId),
          comment_right: { $gte: rightValue },
        },
        {
          $inc: { comment_right: 2 },
        }
      );
      // update many comment_left
      await Comment.updateMany(
        {
          comment_productId: convertToObjectIdMongodb(productId),
          comment_left: { $gt: rightValue },
        },
        {
          $inc: { comment_left: 2 },
        }
      );
    } else {
      const maxRightValue = await Comment.findOne(
        {
          comment_productId: convertToObjectIdMongodb(productId),
        },
        "comment_right",
        { sort: { comment_right: -1 } }
      );
      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1;
      } else {
        rightValue = 1;
      }
    }

    // insert to comment
    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;

    await comment.save();
    return comment;
  };

  static findCommentByParentId = async ({
    productId,
    parentId = null,
    limit = 50,
    skip = 0,
  }) => {
    if (parentId) {
      const parent = await Comment.findById(parentId);
      if (!parent) throw new NotFoundError("Not found comment for product");

      const comments = await Comment.find({
        comment_productId: convertToObjectIdMongodb(productId),
        comment_left: { $gt: parent.comment_left },
        comment_right: { $lt: parent.comment_right },
      })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parentId: 1,
        })
        .sort({
          comment_right: -1,
        });

      return comments;
    }

    return await Comment.find({
      comment_productId: convertToObjectIdMongodb(productId),
      comment_parentId: parentId,
    })
      .skip(skip)
      .limit(limit);
  };

  //1. if comment single then delete it
  //2. if comment is parent then delete it self and child comment
  //3. update left right of higher left, right
  static deleteComment = async ({ id, productId }) => {
    if (!(await ProductServiceV2.checkProductExist({ product_id: productId })))
      throw new NotFoundError("Not found comment for product");
    //1. delete comment and detect left and right
    const comment = await Comment.findOneAndDelete({
      _id: convertToObjectIdMongodb(id),
      comment_productId: convertToObjectIdMongodb(productId),
    });
    if (!comment) throw new NotFoundError("Not found comment");
    const leftValue = comment.comment_left,
      rightValue = comment.comment_right;
    // 2. caculate width
    const width = rightValue - leftValue + 1;

    //3. find children comment and delete
    await Comment.deleteMany({
      comment_left: { $gt: comment.comment_left },
      comment_right: { $lt: comment.comment_right },
      comment_productId: convertToObjectIdMongodb(productId),
    });

    //4. update right left other node
    await Comment.updateMany(
      {
        comment_right: { $gt: comment.comment_right },
        comment_productId: convertToObjectIdMongodb(productId),
      },
      {
        $inc: {
          comment_right: -width,
        },
      }
    );

    await Comment.updateMany(
      {
        comment_left: { $gt: comment.comment_right },
        comment_productId: convertToObjectIdMongodb(productId),
      },
      {
        $inc: {
          comment_left: -width,
        },
      }
    );
    return true;
  };
}

module.exports = CommentService;
