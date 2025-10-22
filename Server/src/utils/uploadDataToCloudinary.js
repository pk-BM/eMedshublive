import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

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

export const uploadFileToCloudinary = async (fileBuffer, originalName) => {
  return new Promise((resolve, reject) => {
    const ext = originalName.split(".").pop().toLowerCase();
    const allowed = ["pdf", "doc", "docx"];
    if (!allowed.includes(ext))
      return reject(
        new Error("Invalid file type. Only PDF or DOC/DOCX allowed.")
      );

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "eMedsHub/Files",
        resource_type: "raw",
        use_filename: true,
        unique_filename: false,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};
