import express from "express";
import { GetMe, Login, Logout, Signup } from "../controller/auth.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.get("/getMe", isAuthenticated, GetMe);
router.post("/logout", isAuthenticated, Logout);

export default router;
