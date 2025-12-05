import express from "express";
import {
  isAuthenticated,
  isAuthorized,
} from "../middleware/auth.middleware.js";
import { Create, Update, GetAbout } from "../controller/about.controller.js";

const router = express.Router();

router.get("/", GetAbout);
router.post("/create", isAuthenticated, isAuthorized("Admin"), Create);
router.post("/update/:id", isAuthenticated, isAuthorized("Admin"), Update);

export default router;
