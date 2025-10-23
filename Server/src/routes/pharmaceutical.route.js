import express from "express";
import multer from "multer";
import {
  isAuthenticated,
  isAuthorized,
} from "../middleware/auth.middleware.js";
import {
  createPharmaceutical,
  getPharmaceuticals,
  getPharmaceuticalById,
  updatePharmaceutical,
  deletePharmaceutical,
  pharmaceuticalOptions,
} from "../controller/pharmaceutical.controller.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get(
  "/options",
  pharmaceuticalOptions
);

// CREATE
router.post(
  "/create",
  isAuthenticated,
  isAuthorized("Admin"),
  upload.fields([{ name: "logo", maxCount: 1 }]),
  createPharmaceutical
);

router.get(
  "/getAll",

  getPharmaceuticals
);

router.get(
  "/:id",

  getPharmaceuticalById
);

router.put(
  "/update/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  upload.fields([{ name: "logo", maxCount: 1 }]),
  updatePharmaceutical
);

router.delete(
  "/delete/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  deletePharmaceutical
);

export default router;
