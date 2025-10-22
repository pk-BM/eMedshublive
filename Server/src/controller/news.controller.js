import mongoose from "mongoose";
import fs from "fs";
import News from "../models/news.model.js";
import { sendResponse } from "../utils/sendResponse.js";
import { uploadImageToCloudinary } from "../utils/uploadDataToCloudinary.js";
import { deleteFromCloudinary } from "../utils/deleteDataFromCloudinary.js";

export const createNews = async (req, res) => {
  try {
    const { title, publishDate } = req.body;

    if (!title || title.trim() === "") {
      return sendResponse(res, 400, false, "News title is required", null);
    }
    if (!publishDate) {
      return sendResponse(res, 400, false, "Publish date is required", null);
    }

    const data = {
      ...req.body,
      createdBy: req.user?._id,
    };
    const image = req?.files?.image?.[0];
    if (image) {
      const imageUrl = await uploadImageToCloudinary(image.buffer);
      if (!imageUrl) {
        return sendResponse(res, 400, false, "Image upload failed", null);
      }
      data.image = imageUrl;
    }

    const news = await News.create(data);

    return sendResponse(res, 201, true, "News created successfully", news);
  } catch (error) {
    console.error("Error in createNews:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};


export const getAllNews = async (req, res) => {
  try {
    const newsList = await News.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    if (!newsList || newsList.length === 0) {
      return sendResponse(res, 404, false, "No news found", null);
    }

    return sendResponse(res, 200, true, "News fetched successfully", newsList);
  } catch (error) {
    console.error("Error in getAllNews:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return sendResponse(res, 400, false, "Invalid ID", null);
    }

    const news = await News.findById(id).populate("createdBy", "name email");
    if (!news) {
      return sendResponse(res, 404, false, "News not found", null);
    }

    return sendResponse(res, 200, true, "News fetched successfully", news);
  } catch (error) {
    console.error("Error in getNewsById:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const updateNews = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return sendResponse(res, 400, false, "Invalid ID", null);
    }

    const existingNews = await News.findById(id);
    if (!existingNews) {
      return sendResponse(res, 404, false, "News not found", null);
    }

    const updatedData = { ...req.body };


    const image = req?.files?.image?.[0];
    if (image) {
      const imageUrl = await uploadImageToCloudinary(image.buffer);
      if (imageUrl) {
        // Delete old Cloudinary image if exists
        if (existingNews.image) {
          await deleteFromCloudinary(existingNews.image);
        }
        updatedData.image = imageUrl;
      } else {
        return sendResponse(res, 400, false, "Image upload failed", null);
      }
    }

    const updatedNews = await News.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    return sendResponse(res, 200, true, "News updated successfully", updatedNews);
  } catch (error) {
    console.error("Error in updateNews:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};


export const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return sendResponse(res, 400, false, "Invalid ID", null);
    }

    const existingNews = await News.findById(id);
    if (!existingNews) {
      return sendResponse(res, 404, false, "News not found", null);
    }

    // Delete image if exists
    if (existingNews.image) {
      await deleteFromCloudinary(existingNews.image);
    }

    await News.findByIdAndDelete(id);
    return sendResponse(res, 200, true, "News deleted successfully", null);
  } catch (error) {
    console.error("Error in deleteNews:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};
