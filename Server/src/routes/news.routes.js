import express from "express";
import multer from "multer";
import {
  isAuthenticated,
  isAuthorized,
} from "../middleware/auth.middleware.js";
import {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
} from "../controller/news.controller.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/create",
  isAuthenticated,
  isAuthorized("Admin"),
  upload.fields([{ name: "image", maxCount: 1 }]),
  createNews
);

router.get("/getAll",  getAllNews);

router.get("/:id", getNewsById);

router.put(
  "/update/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  upload.fields([{ name: "image", maxCount: 1 }]),
  updateNews
);

router.delete(
  "/delete/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  deleteNews
);

export default router;
