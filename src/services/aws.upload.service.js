"use strict";
const { s3, PutObjectCommand } = require("../configs/s3.config");

// 1. upload from url image
const uploadImageFromLocalS3 = async ({ file }) => {
  try {
    const randomImageName = () => crypto.randomBytes(16).toString("hex");
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: randomImageName() || "unknown",
      Body: file.buffer,
      ContentType: "image/jpeg",
    });

    const result = await s3.send(command);
    console.log("result", result);
  } catch (error) {
    console.log("Error upload image from local s3", error);
  }
};

module.exports = {
  uploadImageFromLocalS3,
};
