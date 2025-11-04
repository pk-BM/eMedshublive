import mongoose from "mongoose";
import Generic from "../models/generic.model.js";
import { sendResponse } from "../utils/sendResponse.js";
import {
  uploadFileToCloudinary,
  uploadImageToCloudinary,
} from "../utils/uploadDataToCloudinary.js";
import { deleteFromCloudinary } from "../utils/deleteDataFromCloudinary.js";

export const createGeneric = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return sendResponse(res, 400, false, "Generic name is required", null);
    }

    const data = {
      ...req.body,
      createdBy: req.user?._id,
    };

    // Handle optional image and file uploads
    if (req.files) {
      const image = req?.files?.image?.[0];
      if (image) {
        const imageUrl = await uploadImageToCloudinary(image.buffer);
        if (imageUrl) {
          data.structureImage = imageUrl;
        }
      }

      // Upload File (PDF/DOC)
      const file = req?.files?.file?.[0];
      if (file) {
        const fileUrl = await uploadFileToCloudinary(
          file.buffer,
          file.originalname
        );
        if (fileUrl) {
          data.innovatorMonograph = fileUrl;
        } else {
          return sendResponse(res, 400, false, "File upload failed", null);
        }
      }
    }

    const generic = await Generic.create(data);
    return sendResponse(
      res,
      201,
      true,
      "Generic created successfully",
      generic
    );
  } catch (error) {
    console.error("Error in createGeneric controller:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const getGenerics = async (req, res) => {
  try {
    const generics = await Generic.find().sort({ createdAt: -1 });

    if (!generics || generics.length === 0) {
      return sendResponse(res, 404, false, "No generic records found", null);
    }

    return sendResponse(
      res,
      200,
      true,
      "Generics fetched successfully",
      generics
    );
  } catch (error) {
    console.error("Error in getGenerics controller:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};
export const getAllopathicGenerics = async (req, res) => {
  try {
    const generics = await Generic.find({
      allopathicOrHerbal: "Allopathic",
    }).sort({ createdAt: -1 });

    if (!generics || generics.length === 0) {
      return sendResponse(res, 404, false, "No generic records found", null);
    }

    return sendResponse(
      res,
      200,
      true,
      "Generics fetched successfully",
      generics
    );
  } catch (error) {
    console.error("Error in getGenerics controller:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};
export const getHerbalGenerics = async (req, res) => {
  try {
    const generics = await Generic.find({
      allopathicOrHerbal: "Herbal",
    }).sort({ createdAt: -1 });

    if (!generics || generics.length === 0) {
      return sendResponse(res, 404, false, "No generic records found", null);
    }

    return sendResponse(
      res,
      200,
      true,
      "Generics fetched successfully",
      generics
    );
  } catch (error) {
    console.error("Error in getGenerics controller:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const getGenericById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return sendResponse(res, 400, false, "Invalid ID", null);
    }

    const generic = await Generic.findById(id);
    if (!generic) {
      return sendResponse(res, 404, false, "Generic not found", null);
    }

    return sendResponse(
      res,
      200,
      true,
      "Generic fetched successfully",
      generic
    );
  } catch (error) {
    console.error("Error in getGenericById controller:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const updateGeneric = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return sendResponse(res, 400, false, "Invalid ID", null);
    }

    const existingGeneric = await Generic.findById(id);
    if (!existingGeneric) {
      return sendResponse(res, 404, false, "Generic not found", null);
    }

    const updatedData = { ...req.body };

    if (req.files) {
      const image = req?.files?.image?.[0];
      if (image) {
        const imageUrl = await uploadImageToCloudinary(image.buffer);
        if (imageUrl) {
          if (existingGeneric.structureImage) {
            await deleteFromCloudinary(existingGeneric.structureImage);
          }
          updatedData.structureImage = imageUrl;
        }
      }

      const file = req?.files?.file?.[0];
      if (file) {
        const fileUrl = await uploadFileToCloudinary(
          file.buffer,
          file.originalname
        );
        if (fileUrl) {
          if (existingGeneric.innovatorMonograph) {
            await deleteFromCloudinary(existingGeneric.innovatorMonograph);
          }
          updatedData.innovatorMonograph = fileUrl;
        } else {
          return sendResponse(res, 400, false, "File upload failed", null);
        }
      }
    }

    // Update generic
    const generic = await Generic.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    return sendResponse(
      res,
      200,
      true,
      "Generic updated successfully",
      generic
    );
  } catch (error) {
    console.error("Error in updateGeneric controller:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const deleteGeneric = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return sendResponse(res, 400, false, "Invalid ID", null);
    }

    const existingGeneric = await Generic.findById(id);
    if (!existingGeneric) {
      return sendResponse(res, 404, false, "Generic not found", null);
    }

    if (existingGeneric.structureImage) {
      await deleteFromCloudinary(existingGeneric.structureImage);
    }
    if (existingGeneric.innovatorMonograph) {
      await deleteFromCloudinary(existingGeneric.innovatorMonograph);
    }

    await Generic.findByIdAndDelete(id);

    return sendResponse(res, 200, true, "Generic deleted successfully", null);
  } catch (error) {
    console.error("Error in deleteGeneric controller:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const genericOptions = async (req, res) => {
  try {
    const response = await Generic.find().select("name");
    if (!response) {
      return sendResponse(res, 400, false, "No options available", null);
    }
    sendResponse(res, 200, true, "Options fetched successfuly", response);
  } catch (error) {
    console.error("Error in genericOptions controller:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};
