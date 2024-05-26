"use strict";
const { s3, PutObjectCommand } = require("../configs/s3.config");
const { BadRequestError } = require("../core/error.response");
const crypto = require("node:crypto");
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");

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

    const result = await s3.send(command);

    const url = getSignedUrl({
      url: `${process.env.AWS_CLOUD_FONT_DISTRIBUTION}/${imageName}`,
      keyPairId: process.env.AWS_CLOUD_FONT_KEY_PAIR_ID,
      dateLessThan: new Date(Date.now() + 1000 * 600), // expires in 1 minute
      privateKey: process.env.AWS_CLOUD_FONT_PRIVATE_KEY,
    });

    return {
      url,
      result,
    };
  } catch (error) {
    console.log("Error upload image from local s3", error);
    throw new BadRequestError("Error upload image from local s3");
  }
};

module.exports = {
  uploadImageFromLocalS3,
};
