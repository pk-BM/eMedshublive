import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dtfvymy9c",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Delete file from Cloudinary (image or raw)
 * @param {string} fileUrl - Cloudinary secure_url
 */
export const deleteFromCloudinary = async (fileUrl) => {
  try {
    if (!fileUrl) return;

    // Example URL:
    // https://res.cloudinary.com/dtfvymy9c/image/upload/v1760123694/eMedsHub/Images/ttvlk7txuukwuancdzsn.jpg

    // Split URL to get everything after /upload/
    const urlParts = fileUrl.split("/upload/");
    if (urlParts.length < 2) return;

    // Remove file extension and version number (v1234567)
    let publicPath = urlParts[1].replace(/\.[^/.]+$/, ""); // remove .jpg/.pdf etc.
    publicPath = publicPath.replace(/^v\d+\//, ""); // remove version prefix

    // Determine resource type (image/raw)
    const resourceType = fileUrl.includes("/raw/") ? "raw" : "image";

    const result = await cloudinary.uploader.destroy(publicPath, {
      resource_type: resourceType,
    });

    if (result.result === "ok") {
      console.log("Deleted from Cloudinary:", publicPath);
    } else {
      console.warn("Failed to delete:", publicPath, result);
    }
  } catch (error) {
    console.error("Cloudinary deletion error:", error.message);
  }
};
