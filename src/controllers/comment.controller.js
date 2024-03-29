"use strict";
const { SuccessResponse } = require("../core/success.response");
const CommentService = require("../services/comment.service");

class CommentController {
  createComment = async (req, res, next) => {
    new SuccessResponse({
      message: "Create a comment success",
      metadata: await CommentService.createComment(req.body),
    }).send(res);
  };
  findByParentId = async (req, res, next) => {
    new SuccessResponse({
      message: "Find comment by parent id success",
      metadata: await CommentService.findCommentByParentId(req.query),
    }).send(res);
  };
  delete = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete success",
      metadata: await CommentService.deleteComment(req.query),
    }).send(res);
  };
}

module.exports = new CommentController();
