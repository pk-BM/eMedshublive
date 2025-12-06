import Hero from "../models/hero.model.js";
import { sendResponse } from "../utils/sendResponse.js";
import { uploadImageToCloudinary } from "../utils/uploadDataToCloudinary.js";

export const UploadHero = async (req, res) => {
  try {
    const image = req?.files?.image?.[0];
    if (!image) {
      return sendResponse(res, 400, false, "Image is required", null);
    }

    const imageUrl = await uploadImageToCloudinary(image.buffer);
    if (!imageUrl) {
      return sendResponse(res, 400, false, "Image upload failed", null);
    }

    // Check if hero exists
    let hero = await Hero.findOne();

    if (hero) {
      // Update existing hero
      hero.image = imageUrl;
      await hero.save();

      return sendResponse(res, 200, true, "Hero updated successfully", hero);
    }

    // Create new hero entry
    hero = await Hero.create({ image: imageUrl });

    return sendResponse(res, 201, true, "Hero created successfully", hero);
  } catch (error) {
    console.error("Error in UploadHero:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};

export const GetHero = async (req, res) => {
  try {
    const hero = await Hero.findOne(); // return one object, not array

    return sendResponse(res, 200, true, "Hero fetched successfully", hero);
  } catch (error) {
    console.error("Error in GetHero:", error);
    return sendResponse(
      res,
      500,
      false,
      error.message || "Internal Server Error",
      null
    );
  }
};
