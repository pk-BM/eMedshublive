import express from "express";
import multer from "multer";
import {
  isAuthenticated,
  isAuthorized,
} from "../middleware/auth.middleware.js";
import {
  createAdvertisement,
  getAllAdvertisements,
  getAdvertisementById,
  updateAdvertisement,
  deleteAdvertisement,
} from "../controller/advertisement.controller.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// CREATE
router.post(
  "/create",
  isAuthenticated,
  isAuthorized("Admin"),
  upload.fields([{ name: "image", maxCount: 1 }]),
  createAdvertisement
);

// GET ALL
router.get(
  "/getAll",
  getAllAdvertisements
);

// GET BY ID
router.get(
  "/:id",
  getAdvertisementById
);

// UPDATE
router.put(
  "/update/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  upload.fields([{ name: "image", maxCount: 1 }]),
  updateAdvertisement
);

// DELETE
router.delete(
  "/delete/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  deleteAdvertisement
);

export default router;
