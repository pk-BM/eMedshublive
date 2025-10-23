import express from "express";
import multer from "multer";
import {
  isAuthenticated,
  isAuthorized,
} from "../middleware/auth.middleware.js";
import {
  createDoctorAdvice,
  getAllDoctorAdvices,
  getDoctorAdviceById,
  updateDoctorAdvice,
  deleteDoctorAdvice,
} from "../controller/doctorAdvice.controller.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// CREATE
router.post(
  "/create",
  isAuthenticated,
  isAuthorized("Admin"),
  upload.fields([{ name: "image", maxCount: 1 }]),
  createDoctorAdvice
);

// GET ALL
router.get(
  "/getAll",
  getAllDoctorAdvices
);

// GET BY ID
router.get("/:id", isAuthenticated, getDoctorAdviceById);

// UPDATE
router.put(
  "/update/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  upload.fields([{ name: "image", maxCount: 1 }]),
  updateDoctorAdvice
);

// DELETE
router.delete(
  "/delete/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  deleteDoctorAdvice
);

export default router;
