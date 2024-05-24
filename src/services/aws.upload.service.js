"use strict";
const {
  s3,
  PutObjectCommand,
  GetObjectCommand,
} = require("../configs/s3.config");
const { BadRequestError } = require("../core/error.response");
const crypto = require("node:crypto");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const randomImageName = () => crypto.randomBytes(16).toString("hex");

// 1. upload from url image
const uploadImageFromLocalS3 = async ({ file }) => {
  try {
    const imageName = randomImageName();
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName || "unknown",
      Body: file.buffer,
      ContentType: "image/jpeg",
    });

    await s3.send(command);

    const singeUrl = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName,
    });

    const url = await getSignedUrl(s3, singeUrl, { expiresIn: 3600 });

    return url;
  } catch (error) {
    console.log("Error upload image from local s3", error);
    throw new BadRequestError("Error upload image from local s3");
  }
};

module.exports = {
  uploadImageFromLocalS3,
};
