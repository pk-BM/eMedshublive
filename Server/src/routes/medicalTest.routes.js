import express from "express";
import {
  isAuthenticated,
  isAuthorized,
} from "../middleware/auth.middleware.js";
import {
  createMedicalTest,
  deleteMedicalTest,
  getAllMedicalTest,
  getMedicalTestById,
  updateMedicalTest,
} from "../controller/medicalTest.controller.js";
import multer from "multer";
const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({ storage });

router.post(
  "/create",
  isAuthenticated,
  isAuthorized("Admin"),
  upload.fields([{ name: "image", maxCount: 1 }]),
  createMedicalTest
);
router.get(
  "/getAll",
  getAllMedicalTest
);
router.get(
  "/get/:id",
  getMedicalTestById
);
router.put(
  "/update/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  upload.fields([{ name: "image", maxCount: 1 }]),
  updateMedicalTest
);
router.delete(
  "/delete/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  deleteMedicalTest
);

export default router;
