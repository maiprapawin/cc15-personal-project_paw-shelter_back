const cloudinary = require("../config/cloudinary");

exports.uploadToCloudinary = async (path) => {
  const result = await cloudinary.uploader.upload(path);
  return result.secure_url;
};
