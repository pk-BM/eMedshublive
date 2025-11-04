import express from "express";
import {
  isAuthenticated,
  isAuthorized,
} from "../middleware/auth.middleware.js";
import {
  createGeneric,
  deleteGeneric,
  genericOptions,
  getAllopathicGenerics,
  getGenericById,
  getGenerics,
  getHerbalGenerics,
  updateGeneric,
} from "../controller/generic.controller.js";

import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({ storage });

router.get("/options", genericOptions);

router.post(
  "/create",
  isAuthenticated,
  isAuthorized("Admin"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createGeneric
);
router.get("/getAll", getGenerics);
router.get("/getAllopathicGenerics", getAllopathicGenerics);
router.get("/getHerbalGenerics", getHerbalGenerics);
router.get("/:id", getGenericById);
router.put(
  "/update/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateGeneric
);
router.delete(
  "/delete/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  deleteGeneric
);

// router.get("/options", isAuthenticated, genericOptions);

export default router;
