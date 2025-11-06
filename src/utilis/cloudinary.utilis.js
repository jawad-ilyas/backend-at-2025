import cloudinary from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config(); // ✅ ensures env variables available here too


console.log('====================================');
console.log("process.env.CLOUDINARY_API_KEY,", process.env.CLOUDINARY_API_KEY);
console.log("process.env.CLOUDINARY_SECRET_KEY,", process.env.CLOUDINARY_SECRET_KEY);
console.log('====================================');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const uploadCloudinary = async (localImagePath) => {
  try {
    if (!localImagePath) throw new Error("No file path provided");

    const result = await cloudinary.uploader.upload(localImagePath, {
      folder: "uploads", // optional - creates a folder in Cloudinary
      resource_type: "auto", // handles image, video, etc.
    });

    console.log("✅ Image uploaded to Cloudinary");

    // delete local file after successful upload
    if (fs.existsSync(localImagePath)) fs.unlinkSync(localImagePath);

    return result;
  } catch (error) {
    console.error("❌ Error in cloudinary.util.js :: uploadCloudinary ::", error);

    // delete local file if upload failed
    if (fs.existsSync(localImagePath)) fs.unlinkSync(localImagePath);

    return null;
  }
};

export default uploadCloudinary;
