import { sendResponse } from "../utils/sendResponse.js";
import Leader from "../models/leader.model.js";
import mongoose from "mongoose";
import { uploadImageToCloudinary } from "../utils/uploadDataToCloudinary.js";
import { deleteFromCloudinary } from "../utils/deleteDataFromCloudinary.js";

export const createLeader = async (req, res) => {
  try {
    const { name, designation, previous, institution, department, bio } =
      req.body;

    // Validation
    if (
      !name ||
      !designation ||
      !previous ||
      !institution ||
      !department ||
      !bio
    ) {
      return sendResponse(res, 400, false, "All fields are required", null);
    }

    // Handle image upload
    const image = req?.files?.profilePicture?.[0];
    if (!image) {
      return sendResponse(res, 400, false, "Profile picture is required", null);
    }

    const imageUrl = await uploadImageToCloudinary(image.buffer);
    if (!imageUrl) {
      return sendResponse(res, 400, false, "Image upload failed", null);
    }

    const leader = await Leader.create({
      name,
      designation,
      previous,
      institution,
      department,
      bio,
      profilePicture: imageUrl,
    });

    return sendResponse(res, 201, true, "Leader created successfully", leader);
  } catch (error) {
    console.error("Error in createLeader:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const getAllLeaders = async (req, res) => {
  try {
    const leaders = await Leader.find().sort({ createdAt: -1 });
    if (!leaders || leaders.length === 0) {
      return sendResponse(res, 404, false, "No leaders data found", null);
    }
    return sendResponse(
      res,
      200,
      true,
      "Leaders fetched successfully",
      leaders
    );
  } catch (error) {
    console.error("Error in getAllLeaders:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const getLeaderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return sendResponse(res, 400, false, "ID required", null);
    if (!mongoose.isValidObjectId(id))
      return sendResponse(res, 400, false, "Invalid ID", null);

    const leader = await Leader.findById(id);
    if (!leader) {
      return sendResponse(res, 404, false, "Leader not found", null);
    }
    return sendResponse(res, 200, true, "Leader fetched successfully", leader);
  } catch (error) {
    console.error("Error in getLeaderById:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const updateLeader = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation, previous, institution, department, bio } =
      req.body;

    if (!id) return sendResponse(res, 400, false, "ID required", null);
    if (!mongoose.isValidObjectId(id))
      return sendResponse(res, 400, false, "Invalid ID", null);

    const leader = await Leader.findById(id);
    if (!leader) return sendResponse(res, 404, false, "Leader not found", null);

    let imageUrl = leader.profilePicture;
    const image = req?.files?.profilePicture?.[0];

    // If new image uploaded, replace it
    if (image) {
      const uploadedUrl = await uploadImageToCloudinary(image.buffer);
      if (uploadedUrl) {
        if (leader.profilePicture)
          await deleteFromCloudinary(leader.profilePicture);
        imageUrl = uploadedUrl;
      }
    }

    const updatedLeader = await Leader.findByIdAndUpdate(
      id,
      {
        name,
        designation,
        previous,
        institution,
        department,
        bio,
        profilePicture: imageUrl,
      },
      { new: true, runValidators: true }
    );

    return sendResponse(
      res,
      200,
      true,
      "Leader updated successfully",
      updatedLeader
    );
  } catch (error) {
    console.error("Error in updateLeader:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const deleteLeader = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return sendResponse(res, 400, false, "Id required", null);
    if (!mongoose.isValidObjectId(id))
      return sendResponse(res, 400, false, "Invalid Id", null);

    const leader = await Leader.findById(id);
    if (!leader) return sendResponse(res, 404, false, "Leader not found", null);

    // Delete image from Cloudinary
    if (leader.profilePicture) {
      await deleteFromCloudinary(leader.profilePicture);
    }

    await Leader.findByIdAndDelete(id);

    return sendResponse(res, 200, true, "Leader deleted successfully", null);
  } catch (error) {
    console.error("Error in deleteLeader:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};
