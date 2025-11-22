import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import path from "path";

cloudinary.config({
  cloud_name: "dtfvymy9c",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImageToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "eMedsHub/Images",
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

export const uploadFileToCloudinary = async (fileBuffer, originalname) => {
  try {
    const ext = path.extname(originalname).toLowerCase();
    const allowedExtensions = [".pdf", ".doc", ".docx"];
    if (!allowedExtensions.includes(ext)) {
      throw new Error("Invalid file type. Only PDF or DOC/DOCX allowed.");
    }

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "eMedsHub/Files",
          resource_type: "raw",
          use_filename: true,
          unique_filename: false,
          public_id: path.basename(originalname, ext),
          format: ext.replace(".", ""), // <-- add this line
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        }
      );

      streamifier.createReadStream(fileBuffer).pipe(stream);
    });
  } catch (error) {
    console.error("Cloudinary file upload error:", error);
    return null;
  }
};
