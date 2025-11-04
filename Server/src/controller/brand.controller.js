import mongoose from "mongoose";
import Brand from "../models/brand.model.js";
import { sendResponse } from "../utils/sendResponse.js";
import { uploadImageToCloudinary } from "../utils/uploadDataToCloudinary.js";
import { deleteFromCloudinary } from "../utils/deleteDataFromCloudinary.js";

export const createBrand = async (req, res) => {
  try {
    const { name, productType, generic, manufacturer } = req.body;

    if (!name || !productType) {
      return sendResponse(
        res,
        400,
        false,
        "Brand name and product type are required",
        null
      );
    }

    if (!mongoose.isValidObjectId(generic)) {
      return sendResponse(res, 400, false, "Invalid Generic ID", null);
    }

    if (!mongoose.isValidObjectId(manufacturer)) {
      return sendResponse(res, 400, false, "Invalid Manufacturer ID", null);
    }

    const data = {
      ...req.body,
      createdBy: req.user?._id,
    };

    const image = req?.files?.packImage?.[0];
    if (image) {
      const imageUrl = await uploadImageToCloudinary(image.buffer);
      if (imageUrl) data.packImage = imageUrl;
    }

    const brand = await Brand.create(data);
    return sendResponse(res, 201, true, "Brand created successfully", brand);
  } catch (error) {
    console.error("Error in createBrand:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find()
      .populate("generic", "name therapeuticClass")
      .populate("manufacturer", "name")
      .populate("createdBy", "name email");

    if (!brands || brands.length === 0) {
      return sendResponse(res, 404, false, "No brands found", null);
    }

    return sendResponse(res, 200, true, "Brands fetched successfully", brands);
  } catch (error) {
    console.error("Error in getBrands:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const getAllopathicBrands = async (req, res) => {
  try {
    const brands = await Brand.find({ allopathicOrHerbal: "Allopathic" })
      .populate("generic", "name therapeuticClass")
      .populate("manufacturer", "name")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    if (!brands || brands.length === 0) {
      return sendResponse(res, 404, false, "No brands found", null);
    }

    return sendResponse(res, 200, true, "Brands fetched successfully", brands);
  } catch (error) {
    console.error("Error in getBrands:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const getHerbalBrands = async (req, res) => {
  try {
    const brands = await Brand.find({ allopathicOrHerbal: "Herbal" })
      .populate("generic", "name therapeuticClass")
      .populate("manufacturer", "name")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    if (!brands || brands.length === 0) {
      return sendResponse(res, 404, false, "No brands found", null);
    }

    return sendResponse(res, 200, true, "Brands fetched successfully", brands);
  } catch (error) {
    console.error("Error in getBrands:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return sendResponse(res, 400, false, "Invalid ID", null);
    }

    const brand = await Brand.findById(id)
      .populate("generic")
      .populate("manufacturer")
      .populate("createdBy", "name email");

    if (!brand) {
      return sendResponse(res, 404, false, "Brand not found", null);
    }

    return sendResponse(res, 200, true, "Brand fetched successfully", brand);
  } catch (error) {
    console.error("Error in getBrandById:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return sendResponse(res, 400, false, "Invalid ID", null);
    }

    const existingBrand = await Brand.findById(id);
    if (!existingBrand) {
      return sendResponse(res, 404, false, "Brand not found", null);
    }

    const updatedData = { ...req.body };

    const image = req?.files?.packImage?.[0];
    if (image) {
      const imageUrl = await uploadImageToCloudinary(image.buffer);
      if (imageUrl) {
        if (existingBrand.packImage) {
          await deleteFromCloudinary(existingBrand.packImage);
        }
        updatedData.packImage = imageUrl;
      }
    }

    const updatedBrand = await Brand.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    return sendResponse(
      res,
      200,
      true,
      "Brand updated successfully",
      updatedBrand
    );
  } catch (error) {
    console.error("Error in updateBrand:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return sendResponse(res, 400, false, "Invalid ID", null);
    }

    const existingBrand = await Brand.findById(id);
    if (!existingBrand) {
      return sendResponse(res, 404, false, "Brand not found", null);
    }

    // Delete pack image if exists
    if (existingBrand.packImage) {
      await deleteFromCloudinary(existingBrand.packImage);
    }

    await Brand.findByIdAndDelete(id);
    return sendResponse(res, 200, true, "Brand deleted successfully", null);
  } catch (error) {
    console.error("Error in deleteBrand:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};
