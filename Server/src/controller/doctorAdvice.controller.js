import mongoose from "mongoose";
import DoctorAdvice from "../models/doctorAdvice.model.js";
import { sendResponse } from "../utils/sendResponse.js";
import { uploadImageToCloudinary } from "../utils/uploadDataToCloudinary.js";
import { deleteFromCloudinary } from "../utils/deleteDataFromCloudinary.js";


export const createDoctorAdvice = async (req, res) => {
  try {
    const { title } = req.body;


    if (!title || title.trim() === "") {
      return sendResponse(res, 400, false, "Title is required", null);
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

    const doctorAdvice = await DoctorAdvice.create(data);
    return sendResponse(
      res,
      201,
      true,
      "Doctor advice created successfully",
      doctorAdvice
    );
  } catch (error) {
    console.error("Error in createDoctorAdvice:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};



export const getAllDoctorAdvices = async (req, res) => {
  try {
    const adviceList = await DoctorAdvice.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    if (!adviceList || adviceList.length === 0) {
      return sendResponse(res, 404, false, "No doctor advices found", null);
    }

    return sendResponse(res, 200, true, "Doctor advices fetched successfully", adviceList);
  } catch (error) {
    console.error("Error in getAllDoctorAdvices:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const getDoctorAdviceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return sendResponse(res, 400, false, "Invalid ID", null);
    }

    const doctorAdvice = await DoctorAdvice.findById(id).populate(
      "createdBy",
      "name email"
    );

    if (!doctorAdvice) {
      return sendResponse(res, 404, false, "Doctor advice not found", null);
    }

    return sendResponse(res, 200, true, "Doctor advice fetched successfully", doctorAdvice);
  } catch (error) {
    console.error("Error in getDoctorAdviceById:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};


export const updateDoctorAdvice = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.isValidObjectId(id)) {
      return sendResponse(res, 400, false, "Invalid ID", null);
    }

    const existingAdvice = await DoctorAdvice.findById(id);
    if (!existingAdvice) {
      return sendResponse(res, 404, false, "Doctor advice not found", null);
    }

    const updatedData = { ...req.body };

    const image = req?.files?.image?.[0];
    if (image) {
      const imageUrl = await uploadImageToCloudinary(image.buffer);

      if (imageUrl) {
        if (existingAdvice.image) {
          await deleteFromCloudinary(existingAdvice.image);
        }
        updatedData.image = imageUrl;
      }
    }

    const updatedAdvice = await DoctorAdvice.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    return sendResponse(
      res,
      200,
      true,
      "Doctor advice updated successfully",
      updatedAdvice
    );
  } catch (error) {
    console.error("Error in updateDoctorAdvice:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};



export const deleteDoctorAdvice = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return sendResponse(res, 400, false, "Invalid ID", null);
    }

    const existingAdvice = await DoctorAdvice.findById(id);
    if (!existingAdvice) {
      return sendResponse(res, 404, false, "Doctor advice not found", null);
    }

    // Delete image from Cloudinary if exists
    if (existingAdvice.image) {
      await deleteFromCloudinary(existingAdvice.image);
    }

    await DoctorAdvice.findByIdAndDelete(id);
    return sendResponse(res, 200, true, "Doctor advice deleted successfully", null);
  } catch (error) {
    console.error("Error in deleteDoctorAdvice:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};
