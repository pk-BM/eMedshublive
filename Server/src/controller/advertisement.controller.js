import mongoose from "mongoose";
import Advertisement from "../models/advertisement.model.js";
import { sendResponse } from "../utils/sendResponse.js";
import { uploadImageToCloudinary } from "../utils/uploadDataToCloudinary.js";
import { deleteFromCloudinary } from "../utils/deleteDataFromCloudinary.js";

export const createAdvertisement = async (req, res) => {
  try {
    const { organization } = req.body;

    if (!organization || organization.trim() === "") {
      return sendResponse(
        res,
        400,
        false,
        "Organization name is required",
        null
      );
    }

    const data = {
      ...req.body,
      createdBy: req.user?._id,
    };

    const image = req?.files?.image?.[0];
    if (image) {
      const imageUrl = await uploadImageToCloudinary(image.buffer);
      if (imageUrl) data.image = imageUrl;
    }

    const advertisement = await Advertisement.create(data);
    return sendResponse(
      res,
      201,
      true,
      "Advertisement created successfully",
      advertisement
    );
  } catch (error) {
    console.error("Error in createAdvertisement:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const getAllAdvertisements = async (req, res) => {
  try {
    const adsList = await Advertisement.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    if (!adsList || adsList.length === 0) {
      return sendResponse(res, 404, false, "No advertisements found", null);
    }

    return sendResponse(
      res,
      200,
      true,
      "Advertisements fetched successfully",
      adsList
    );
  } catch (error) {
    console.error("Error in getAllAdvertisements:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const getAdvertisementById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return sendResponse(res, 400, false, "Invalid ID", null);
    }

    const advertisement = await Advertisement.findById(id).populate(
      "createdBy",
      "name email"
    );
    if (!advertisement) {
      return sendResponse(res, 404, false, "Advertisement not found", null);
    }

    return sendResponse(
      res,
      200,
      true,
      "Advertisement fetched successfully",
      advertisement
    );
  } catch (error) {
    console.error("Error in getAdvertisementById:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const updateAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return sendResponse(res, 400, false, "Invalid ID", null);
    }

    const existingAd = await Advertisement.findById(id);
    if (!existingAd) {
      return sendResponse(res, 404, false, "Advertisement not found", null);
    }

    const updatedData = { ...req.body };


    const image = req?.files?.image?.[0];
    if (image) {
      const imageUrl = await uploadImageToCloudinary(image.buffer);
      if (imageUrl) {
        if (existingAd.image) {
          await deleteFromCloudinary(existingAd.image);
        }
        updatedData.image = imageUrl;
      }
    }

    const updatedAd = await Advertisement.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    return sendResponse(
      res,
      200,
      true,
      "Advertisement updated successfully",
      updatedAd
    );
  } catch (error) {
    console.error("Error in updateAdvertisement:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const deleteAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return sendResponse(res, 400, false, "Invalid ID", null);
    }

    const existingAd = await Advertisement.findById(id);
    if (!existingAd) {
      return sendResponse(res, 404, false, "Advertisement not found", null);
    }

    // Delete image from Cloudinary if exists
    if (existingAd.image) {
      await deleteFromCloudinary(existingAd.image);
    }

    await Advertisement.findByIdAndDelete(id);
    return sendResponse(
      res,
      200,
      true,
      "Advertisement deleted successfully",
      null
    );
  } catch (error) {
    console.error("Error in deleteAdvertisement:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};
