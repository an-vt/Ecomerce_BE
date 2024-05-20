"use strict";
const cloudinary = require("../configs/cloudinary.config");

// 1. upload from url image
const uploadImageFromUrl = async (url) => {
  try {
    const urlImage =
      "https://cdn.24h.com.vn/upload/3-2023/images/2023-08-15/Ngam-than-hinh-phu-huynh-cua-gai-xinh-co-doi-tu-gay-tranh-cai-12-1692073627-320-width650height808.jpg";
    const folderName = "product/shop01";
    const result = await cloudinary.uploader.upload(urlImage, {
      folder: folderName,
    });
    return result;
  } catch (error) {
    console.log("error", error);
  }
};

const uploadImageFromLocal = async ({ path, folderName }) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      public_id: "thumb",
      folder: folderName,
    });
    return {
      image_url: result.secure_url,
      shopId: 1001,
      thumb_url: await cloudinary.url(result.public_id, {
        width: 100,
        height: 100,
        format: "jpg",
      }),
    };
  } catch (error) {
    console.log("error", error);
  }
};

module.exports = {
  uploadImageFromUrl,
  uploadImageFromLocal,
};
