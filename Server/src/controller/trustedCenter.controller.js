import mongoose from "mongoose";
import fs from "fs";
import TrustedCenter from "../models/trustedCenter.model.js";
import { sendResponse } from "../utils/sendResponse.js";
import { uploadImageToCloudinary } from "../utils/uploadDataToCloudinary.js";
import { deleteFromCloudinary } from "../utils/deleteDataFromCloudinary.js";

export const createTrustedCenter = async (req, res) => {
  try {
    const { name } = req.body;


    if (!name || name.trim() === "") {
      return sendResponse(res, 400, false, "Name is required", null);
    }

    const logo = req?.files?.logo?.[0];
    if (!logo) {
      return sendResponse(res, 400, false, "Logo is required", null);
    }

 
    const imageUrl = await uploadImageToCloudinary(logo.buffer);
    if (!imageUrl) {
      return sendResponse(res, 400, false, "Logo upload failed", null);
    }


    const trustedCenter = await TrustedCenter.create({
      name,
      logo: imageUrl,
    });

    return sendResponse(
      res,
      201,
      true,
      "Center added successfully",
      trustedCenter
    );
  } catch (error) {
    console.error("Error in createTrustedCenter:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};


export const getTrustedCenterById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return sendResponse(res, 400, false, "Id required", null);
    }

    const data = await TrustedCenter.findById(id);
    if (!data) {
      return sendResponse(res, 400, false, "Data notfound", null);
    }

    return sendResponse(res, 200, true, "Data fetched", data);
  } catch (error) {
    console.error("Error in createTrustedCenter controller:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const getAllTrustedCenter = async (req, res) => {
  try {
    const centers = await TrustedCenter.find().sort({ createdAt: -1 });
    if (!centers || centers.length === 0) {
      return sendResponse(res, 404, false, "No centers found", null);
    }
    return sendResponse(
      res,
      200,
      true,
      "Centers fetched successfully",
      centers
    );
  } catch (error) {
    console.error("Error in getAllTrustedCenter controller:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const updateTrustedCenter = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;


    if (!id) {
      return sendResponse(res, 400, false, "Id required", null);
    }
    if (!mongoose.isValidObjectId(id)) {
      return sendResponse(res, 400, false, "Invalid Id", null);
    }

    const existingCenter = await TrustedCenter.findById(id);
    if (!existingCenter) {
      return sendResponse(res, 404, false, "Center not found", null);
    }

    let updatedData = { name: name || existingCenter.name };

    const logo = req?.files?.logo?.[0];
    if (logo) {
      const imageUrl = await uploadImageToCloudinary(logo.buffer);
      if (imageUrl) {

        if (existingCenter.logo) {
          await deleteFromCloudinary(existingCenter.logo);
        }
        updatedData.logo = imageUrl;
      } else {
        return sendResponse(res, 400, false, "Logo upload failed", null);
      }
    }

    const updatedCenter = await TrustedCenter.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    return sendResponse(
      res,
      200,
      true,
      "Center updated successfully",
      updatedCenter
    );
  } catch (error) {
    console.error("Error in updateTrustedCenter:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};


export const deleteTrustedCenter = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) return sendResponse(res, 400, false, "Id required", null);
    if (!mongoose.isValidObjectId(id))
      return sendResponse(res, 400, false, "Invalid Id", null);

    const existingCenter = await TrustedCenter.findById(id);
    if (!existingCenter)
      return sendResponse(res, 404, false, "Center not found", null);

    if (existingCenter.logo) await deleteFromCloudinary(existingCenter.logo);
    await TrustedCenter.findByIdAndDelete(id);

    return sendResponse(res, 200, true, "Center deleted successfully", null);
  } catch (error) {
    console.error("Error in deleteTrustedCenter controller:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};
export const TrustedCenterOptions = async (req, res) => {
  try {
    const response = await TrustedCenter.find().select("name logo");
    if (!response) {
      return sendResponse(res, 400, false, "No options available", null);
    }
    sendResponse(res, 200, true, "Options fetched successfuly", response);
  } catch (error) {
    console.error("Error in TrustedCenter Options controller:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};
