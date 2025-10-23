import express from "express";
import {
  isAuthenticated,
  isAuthorized,
} from "../middleware/auth.middleware.js";
import {
  createTrustedCenter,
  deleteTrustedCenter,
  getAllTrustedCenter,
  updateTrustedCenter,
  TrustedCenterOptions,
  getTrustedCenterById,
} from "../controller/trustedCenter.controller.js";
import multer from "multer";
const storage = multer.memoryStorage();
const router = express.Router();

const upload = multer({ storage });

//MISSING GET BY ID ROUTE

router.post(
  "/create",
  isAuthenticated,
  isAuthorized("Admin"),
  upload.fields([{ name: "logo", maxCount: 1 }]),
  createTrustedCenter
);
router.get(
  "/getAll",

  getAllTrustedCenter
);
router.get(
  "/getById/:id",

  getTrustedCenterById
);
router.put(
  "/update/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  upload.fields([{ name: "logo", maxCount: 1 }]),
  updateTrustedCenter
);
router.delete(
  "/delete/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  deleteTrustedCenter
);
router.get(
  "/options",

  TrustedCenterOptions
);

export default router;
