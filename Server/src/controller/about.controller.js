import About from "../models/about.model.js";
import { sendResponse } from "../utils/sendResponse.js";

export const Create = async (req, res) => {
  try {
    const { about } = req.body;

    if (!about || about.trim() === "") {
      return sendResponse(res, 400, false, "About text is required", null);
    }

    // Check if About already exists
    const exists = await About.findOne();
    if (exists) {
      return sendResponse(
        res,
        400,
        false,
        "About already exists. Use update instead.",
        null
      );
    }

    const newAbout = await About.create({ about });

    return sendResponse(res, 201, true, "About created successfully", newAbout);
  } catch (error) {
    console.error("Error in About-Create controller:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const Update = async (req, res) => {
  try {
    const { about } = req.body;

    if (!about || about.trim() === "") {
      return sendResponse(res, 400, false, "About text is required", null);
    }

    // Fetch existing About
    let data = await About.findOne();
    if (!data) {
      return sendResponse(res, 404, false, "About not found", null);
    }

    data.about = about;
    await data.save();

    return sendResponse(res, 200, true, "About updated successfully", data);
  } catch (error) {
    console.error("Error in About-Update controller:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const GetAbout = async (req, res) => {
  try {
    const data = await About.findOne();

    if (!data) {
      return sendResponse(res, 200, true, "No about data found", null);
    }

    return sendResponse(
      res,
      200,
      true,
      "About data fetched successfully",
      data
    );
  } catch (error) {
    console.error("Error in GetAbout controller:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};
