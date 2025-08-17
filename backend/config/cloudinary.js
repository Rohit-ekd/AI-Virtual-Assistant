import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Move config to top-level
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(filePath);
    fs.unlinkSync(filePath); // Delete the file after upload
    return uploadResult.secure_url;
  } catch (error) {
    try { fs.unlinkSync(filePath); } catch {}
    throw new Error("Cloudinary Upload Error: " + error.message);
  }
};

export default uploadOnCloudinary;