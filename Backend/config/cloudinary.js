const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Config for both lost and found items
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for lost items
const lostItemStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "tracepoint-lost-items",
    allowed_formats: ["jpg", "png", "jpeg"],
     transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

// ✅ Storage for found items
const foundItemStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "tracepoint-found-items",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

module.exports = {
  cloudinary,
  lostItemStorage,
  foundItemStorage
};
