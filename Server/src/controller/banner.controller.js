import mongoose from "mongoose";
import Banner from "../models/banner.model.js";
import { sendResponse } from "../utils/sendResponse.js";
import { uploadImageToCloudinary } from "../utils/uploadDataToCloudinary.js";
import { deleteFromCloudinary } from "../utils/deleteDataFromCloudinary.js";

// CREATE BANNER
export const createBanner = async (req, res) => {
  try {
    if (!req.body.position || !req.body.link) {
      return sendResponse(res, 400, false, "All fields are required", null);
    }
    const image = req?.files?.bannerImg?.[0];
    if (!image) {
      return sendResponse(res, 400, false, "Banner image is required", null);
    }
    const imageUrl = await uploadImageToCloudinary(image.buffer);
    if (!imageUrl) {
      return sendResponse(res, 400, false, "Image upload failed", null);
    }

    const banner = await Banner.create({
      bannerImgUrl: imageUrl,
      createdBy: req.user?._id,
      position: req.body.position,
      link: req.body.link,
    });

    return sendResponse(res, 201, true, "Banner created successfully", banner);
  } catch (error) {
    console.error("Error in createBanner:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

// GET ALL BANNERS
export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });

    if (!banners.length) {
      return sendResponse(res, 404, false, "No banners found", null);
    }

    return sendResponse(
      res,
      200,
      true,
      "Banners fetched successfully",
      banners
    );
  } catch (error) {
    console.error("Error in getAllBanners:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};
// GET LIMITED BANNERS
export const getLimitedBanners = async (req, res) => {
  try {
    const horizontalBanners = await Banner.find({ position: "horizontal" })
      .select("bannerImgUrl link")
      .limit(18)
      .sort({ createdAt: -1 });

    const verticalBanners = await Banner.find({ position: "vertical" })
      .select("bannerImgUrl link")
      .limit(18)
      .sort({ createdAt: -1 });

    const banners = { horizontalBanners, verticalBanners };

    return sendResponse(
      res,
      200,
      true,
      "Banners fetched successfully",
      banners
    );
  } catch (error) {
    console.error("Error in getLimitedBanners:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

// GET SINGLE BANNER
export const getBannerById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return sendResponse(res, 400, false, "Invalid ID", null);
    }

    const banner = await Banner.findById(id);
    if (!banner) {
      return sendResponse(res, 404, false, "Banner not found", null);
    }

    return sendResponse(res, 200, true, "Banner fetched successfully", banner);
  } catch (error) {
    console.error("Error in getBannerById:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

// UPDATE BANNER
export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return sendResponse(res, 400, false, "Invalid ID", null);
    }

    if (!req.body.position || !req.body.link) {
      return sendResponse(res, 400, false, "All fields are required", null);
    }

    const existingBanner = await Banner.findById(id);
    if (!existingBanner) {
      return sendResponse(res, 404, false, "Banner not found", null);
    }

    const image = req?.files?.bannerImg?.[0];
    if (image) {
      const imageUrl = await uploadImageToCloudinary(image.buffer);
      if (imageUrl) {
        if (existingBanner.bannerImgUrl) {
          await deleteFromCloudinary(existingBanner.bannerImgUrl);
        }
        existingBanner.bannerImgUrl = imageUrl;
      }
    }
    existingBanner.position = req.body.position;
    existingBanner.link = req.body.link;
    await existingBanner.save();

    return sendResponse(
      res,
      200,
      true,
      "Banner updated successfully",
      existingBanner
    );
  } catch (error) {
    console.error("Error in updateBanner:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

// DELETE BANNER
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return sendResponse(res, 400, false, "Invalid ID", null);
    }

    const banner = await Banner.findById(id);
    if (!banner) {
      return sendResponse(res, 404, false, "Banner not found", null);
    }

    if (banner.bannerImgUrl) {
      await deleteFromCloudinary(banner.bannerImgUrl);
    }

    await Banner.findByIdAndDelete(id);

    return sendResponse(res, 200, true, "Banner deleted successfully", null);
  } catch (error) {
    console.error("Error in deleteBanner:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};
