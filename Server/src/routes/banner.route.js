import express from "express";
import multer from "multer";
import { isAuthenticated, isAuthorized } from "../middleware/auth.middleware.js";
import {
    createBanner,
    getAllBanners,
    getBannerById,
    updateBanner,
    deleteBanner,
    getLimitedBanners,
} from "../controller/banner.controller.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// CREATE
router.post(
    "/create",
    isAuthenticated,
    isAuthorized("Admin"),
    upload.fields([{ name: "bannerImg", maxCount: 1 }]),
    createBanner
);

// GET ALL
router.get("/getAll", getAllBanners);

// GET ALL
router.get("/getLimitedBanners", getLimitedBanners);

// GET BY ID
router.get("/:id", getBannerById);

// UPDATE
router.put(
    "/update/:id",
    isAuthenticated,
    isAuthorized("Admin"),
    upload.fields([{ name: "bannerImg", maxCount: 1 }]),
    updateBanner
);

// DELETE
router.delete(
    "/delete/:id",
    isAuthenticated,
    isAuthorized("Admin"),
    deleteBanner
);

export default router;
