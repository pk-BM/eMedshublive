import express from "express";
import { Analytics, GetMe, Login, Logout, Signup } from "../controller/auth.controller.js";
import { isAuthenticated, isAuthorized } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.get("/getMe", isAuthenticated, GetMe);
router.post("/logout", isAuthenticated, Logout);
router.get("/analytics", isAuthenticated, isAuthorized("Admin"), Analytics)

export default router;
