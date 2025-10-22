import mongoose from "mongoose";
import { sendResponse } from "../utils/sendResponse.js";
import { uploadImageToCloudinary } from "../utils/uploadDataToCloudinary.js";
import { deleteFromCloudinary } from "../utils/deleteDataFromCloudinary.js";
import Pharmaceutical from "../models/pharmaceutical.model.js"

export const createPharmaceutical = async (req, res) => {
  try {
    const { name } = req.body;


    if (!name || name.trim() === "") {
      return sendResponse(
        res,
        400,
        false,
        "Manufacturer name is required",
        null
      );
    }

    const data = {
      ...req.body,
      createdBy: req.user?._id,
    };


    const logo = req?.files?.logo?.[0];
    if (logo) {
      const imageUrl = await uploadImageToCloudinary(logo.buffer);
      if (!imageUrl) {
        return sendResponse(res, 400, false, "Logo upload failed", null);
      }
      data.logo = imageUrl;
    }


    const pharma = await Pharmaceutical.create(data);
    return sendResponse(
      res,
      201,
      true,
      "Pharmaceutical created successfully",
      pharma
    );
  } catch (error) {
    console.error("Error in createPharmaceutical:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};


export const getPharmaceuticals = async (req, res) => {
  try {
    const pharmaList = await Pharmaceutical.find().populate(
      "createdBy",
      "name email"
    );
    if (!pharmaList || pharmaList.length === 0) {
      return sendResponse(
        res,
        404,
        false,
        "No pharmaceutical records found",
        null
      );
    }
    return sendResponse(
      res,
      200,
      true,
      "Pharmaceuticals fetched successfully",
      pharmaList
    );
  } catch (error) {
    console.error("Error in getPharmaceuticals:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const getPharmaceuticalById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return sendResponse(res, 400, false, "Invalid ID", null);
    }

    const pharma = await Pharmaceutical.findById(id).populate(
      "createdBy",
      "name email"
    );
    if (!pharma) {
      return sendResponse(res, 404, false, "Pharmaceutical not found", null);
    }

    return sendResponse(
      res,
      200,
      true,
      "Pharmaceutical fetched successfully",
      pharma
    );
  } catch (error) {
    console.error("Error in getPharmaceuticalById:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const updatePharmaceutical = async (req, res) => {
  try {
    const { id } = req.params;


    if (!id) {
      return sendResponse(res, 400, false, "Id required", null);
    }
    if (!mongoose.isValidObjectId(id)) {
      return sendResponse(res, 400, false, "Invalid ID", null);
    }

    const existingPharma = await Pharmaceutical.findById(id);
    if (!existingPharma) {
      return sendResponse(res, 404, false, "Pharmaceutical not found", null);
    }

    const updateData = { ...req.body };


    const logo = req?.files?.logo?.[0];
    if (logo) {
      const imageUrl = await uploadImageToCloudinary(logo.buffer);
      if (imageUrl) {
        // Delete old logo if exists
        if (existingPharma.logo) {
          await deleteFromCloudinary(existingPharma.logo);
        }
        updateData.logo = imageUrl;
      } else {
        return sendResponse(res, 400, false, "Logo upload failed", null);
      }
    }


    const updatedPharma = await Pharmaceutical.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    return sendResponse(
      res,
      200,
      true,
      "Pharmaceutical updated successfully",
      updatedPharma
    );
  } catch (error) {
    console.error("Error in updatePharmaceutical:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};


export const deletePharmaceutical = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return sendResponse(res, 400, false, "Invalid ID", null);
    }

    const existingPharma = await Pharmaceutical.findById(id);
    if (!existingPharma) {
      return sendResponse(res, 404, false, "Pharmaceutical not found", null);
    }

    if (existingPharma.logo) {
      await deleteFromCloudinary(existingPharma.logo);
    }

    await Pharmaceutical.findByIdAndDelete(id);
    return sendResponse(
      res,
      200,
      true,
      "Pharmaceutical deleted successfully",
      null
    );
  } catch (error) {
    console.error("Error in deletePharmaceutical:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const pharmaceuticalOptions = async (req, res) => {
  try {
    const response = await Pharmaceutical.find().select("name");
    if (!response) {
      return sendResponse(res, 400, false, "No options available", null);
    }
    sendResponse(res, 200, true, "Options fetched successfuly", response);
  } catch (error) {
    console.error("Error in pharmaceuticalOptions controller:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};
