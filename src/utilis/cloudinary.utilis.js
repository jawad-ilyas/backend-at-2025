import cloudinary from "cloudinary";
import fs from "fs";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const uploadCloudinary = async (localImagePath) => {
  try {
    if (!localImagePath) throw new Error("No file path provided");

    const result = await cloudinary.v2.uploader.upload(localImagePath, {
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
