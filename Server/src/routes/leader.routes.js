import express from "express";
import {
  isAuthenticated,
  isAuthorized,
} from "../middleware/auth.middleware.js";
import {
  createLeader,
  deleteLeader,
  getAllLeaders,
  getLeaderById,
  updateLeader,
} from "../controller/leader.controller.js";
import multer from "multer";
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/create",
  isAuthenticated,
  isAuthorized("Admin"),
  upload.fields([{ name: "profilePicture", maxCount: 1 }]),
  createLeader
);
router.get("/getAll", getAllLeaders);
router.get("/get/:id", getLeaderById);
router.put(
  "/update/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  upload.fields([{ name: "profilePicture", maxCount: 1 }]),
  updateLeader
);
router.delete(
  "/delete/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  deleteLeader
);

export default router;
