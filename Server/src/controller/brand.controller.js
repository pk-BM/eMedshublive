import mongoose from "mongoose";
import Brand from "../models/brand.model.js";
import { sendResponse } from "../utils/sendResponse.js";
import { uploadImageToCloudinary } from "../utils/uploadDataToCloudinary.js";
import { deleteFromCloudinary } from "../utils/deleteDataFromCloudinary.js";

export const createBrand = async (req, res) => {
  try {
    const { name, productType, generic, manufacturer, alternateBrands } = req.body;

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

    // Handle alternateBrands array
    if (alternateBrands) {
      if (typeof alternateBrands === "string") {
        try {
          data.alternateBrands = JSON.parse(alternateBrands);
        } catch {
          data.alternateBrands = alternateBrands.split(",").filter(Boolean);
        }
      }
    }

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
      .populate("generic", "name therapeuticClass")
      .populate("manufacturer", "name")
      .populate("alternateBrands", "name packImage strength unitPrice")
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
    const { alternateBrands } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return sendResponse(res, 400, false, "Invalid ID", null);
    }

    const existingBrand = await Brand.findById(id);
    if (!existingBrand) {
      return sendResponse(res, 404, false, "Brand not found", null);
    }

    const updatedData = { ...req.body };

    // Handle alternateBrands array
    if (alternateBrands) {
      if (typeof alternateBrands === "string") {
        try {
          updatedData.alternateBrands = JSON.parse(alternateBrands);
        } catch {
          updatedData.alternateBrands = alternateBrands.split(",").filter(Boolean);
        }
      }
    }

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

export const getBrandImages = async (req, res) => {
  try {
    const brandsImages = await Brand.find()
      .select("packImage")
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, "sucess", brandsImages);
  } catch (error) {
    console.error("Error in getBrandImages:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const getBrandOptions = async (req, res) => {
  try {
    const brands = await Brand.find()
      .select("_id name")
      .sort({ name: 1 });

    return sendResponse(res, 200, true, "Brand options fetched successfully", brands);
  } catch (error) {
    console.error("Error in getBrandOptions:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const getBrandsByManufacturer = async (req, res) => {
  try {
    const { manufacturerId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;

    if (!mongoose.isValidObjectId(manufacturerId)) {
      return sendResponse(res, 400, false, "Invalid Manufacturer ID", null);
    }

    const brands = await Brand.find({ manufacturer: manufacturerId })
      .populate("generic", "name therapeuticClass")
      .populate("manufacturer", "name")
      .select("productType name strength unitPrice packImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Brand.countDocuments({ manufacturer: manufacturerId });

    if (!brands || brands.length === 0) {
      return sendResponse(res, 404, false, "No brands found for this manufacturer", null);
    }

    return sendResponse(res, 200, true, "Brands fetched successfully", {
      brands,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("Error in getBrandsByManufacturer:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};
