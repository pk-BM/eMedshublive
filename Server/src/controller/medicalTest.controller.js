import { sendResponse } from "../utils/sendResponse.js";
import MedicalTest from "../models/medicalTest.model.js";
import mongoose from "mongoose";
import { uploadImageToCloudinary } from "../utils/uploadDataToCloudinary.js";
import { deleteFromCloudinary } from "../utils/deleteDataFromCloudinary.js";

export const createMedicalTest = async (req, res) => {
  try {
    const { name, description, trustedCenters } = req.body;

    // Validation
    if (!name || !description) {
      return sendResponse(
        res,
        400,
        false,
        "Test name and description are required",
        null
      );
    }

    let centers = trustedCenters;
    if (typeof trustedCenters === "string") {
      try {
        centers = JSON.parse(trustedCenters);
      } catch {
        return sendResponse(
          res,
          400,
          false,
          "Invalid trustedCenters format",
          null
        );
      }
    }

    if (!Array.isArray(centers) || centers.length === 0) {
      return sendResponse(
        res,
        400,
        false,
        "Please select trusted centers",
        null
      );
    }

    const image = req?.files?.image?.[0];
    if (!image) {
      return sendResponse(res, 400, false, "Image is required", null);
    }

    const imageUrl = await uploadImageToCloudinary(image.buffer);
    if (!imageUrl) {
      return sendResponse(res, 400, false, "Image upload failed", null);
    }

    const medicalTest = await MedicalTest.create({
      name,
      description,
      trustedCenters: centers,
      image: imageUrl,
      createdBy: req.user?._id,
    });

    return sendResponse(
      res,
      201,
      true,
      "Medical test created successfully",
      medicalTest
    );
  } catch (error) {
    console.error("Error in createMedicalTest:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const getAllMedicalTest = async (req, res) => {
  try {
    const medicalTests = await MedicalTest.find().sort({ createdAt: -1 });
    if (!medicalTests || medicalTests.length === 0) {
      return sendResponse(res, 404, false, "No medical tests found", null);
    }
    return sendResponse(
      res,
      200,
      true,
      "Medical tests fetched successfully",
      medicalTests
    );
  } catch (error) {
    console.error("Error in getAllMedicalTest controller:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const getMedicalTestById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) return sendResponse(res, 400, false, "Id required", null);
    if (!mongoose.isValidObjectId(id))
      return sendResponse(res, 400, false, "Invalid Id", null);

    const medicalTest = await MedicalTest.findById(id);
    if (!medicalTest) {
      return sendResponse(res, 404, false, "Medical test not found", null);
    }
    return sendResponse(
      res,
      200,
      true,
      "Medical test fetched successfully",
      medicalTest
    );
  } catch (error) {
    console.error("Error in getMedicalTestById controller:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const updateMedicalTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, trustedCenters } = req.body;

    // Validate ID & fields
    if (!id) return sendResponse(res, 400, false, "ID is required", null);
    if (!mongoose.isValidObjectId(id)) {
      return sendResponse(res, 400, false, "Invalid ID", null);
    }
    if (!name || !description) {
      return sendResponse(
        res,
        400,
        false,
        "Name and description are required",
        null
      );
    }

    let centers = trustedCenters;
    if (typeof trustedCenters === "string") {
      try {
        centers = JSON.parse(trustedCenters);
      } catch {
        return sendResponse(
          res,
          400,
          false,
          "Invalid trustedCenters format",
          null
        );
      }
    }

    const medicalTest = await MedicalTest.findById(id);
    if (!medicalTest) {
      return sendResponse(res, 404, false, "Medical test not found", null);
    }

    const image = req?.files?.image?.[0];
    let imageUrl = medicalTest.image;

    if (image) {
      const uploadedUrl = await uploadImageToCloudinary(image.buffer);
      if (uploadedUrl) {
        if (medicalTest.image) await deleteFromCloudinary(medicalTest.image);
        imageUrl = uploadedUrl;
      }
    }

    const updateData = {
      name,
      description,
      trustedCenters: centers,
      image: imageUrl,
    };

    const updatedTest = await MedicalTest.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return sendResponse(
      res,
      200,
      true,
      "Medical test updated successfully",
      updatedTest
    );
  } catch (error) {
    console.error("Error in updateMedicalTest:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const deleteMedicalTest = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) return sendResponse(res, 400, false, "Id required", null);
    if (!mongoose.isValidObjectId(id))
      return sendResponse(res, 400, false, "Invalid Id", null);

    const isTestAvailable = await MedicalTest.findById(id);
    if (!isTestAvailable) {
      return sendResponse(res, 404, false, "Not found", null);
    }
    if (isTestAvailable.image) {
      await deleteFromCloudinary(isTestAvailable.image);
    }

    await MedicalTest.findByIdAndDelete(id);

    return sendResponse(
      res,
      200,
      true,
      "Medical test deleted successfully",
      null
    );
  } catch (error) {
    console.error("Error in deleteMedicalTest controller:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const getLatestTests = async (req, res) => {
  try {
    const response = await MedicalTest.find()
      .select("name description")
      .limit(4)
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, "success", response);
  } catch (error) {
    console.error("Error in getLatestTests controller:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};
