import express from "express";
import multer from "multer";
import {
  isAuthenticated,
  isAuthorized,
} from "../middleware/auth.middleware.js";
import { UploadHero, GetHero } from "../controller/hero.controller.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/upload",
  isAuthenticated,
  isAuthorized("Admin"),
  upload.fields([{ name: "image", maxCount: 1 }]),
  UploadHero
);
router.get("/get", GetHero);

export default router;
