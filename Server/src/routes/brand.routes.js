import express from "express";
import multer from "multer";
import {
  isAuthenticated,
  isAuthorized,
} from "../middleware/auth.middleware.js";
import {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
  getAllopathicBrands,
  getHerbalBrands,
  getBrandImages,
} from "../controller/brand.controller.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/getBrandImages", getBrandImages);

router.post(
  "/create",
  isAuthenticated,
  isAuthorized("Admin"),
  upload.fields([{ name: "packImage", maxCount: 1 }]),
  createBrand
);

router.get("/getAll", getBrands);

router.get("/getAllopathicBrands", getAllopathicBrands);
router.get("/getHerbalBrands", getHerbalBrands);

router.get("/:id", getBrandById);

router.put(
  "/update/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  upload.fields([{ name: "packImage", maxCount: 1 }]),
  updateBrand
);

router.delete(
  "/delete/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  deleteBrand
);

export default router;
