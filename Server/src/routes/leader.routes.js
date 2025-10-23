import express from "express"
import { isAuthenticated, isAuthorized } from "../middleware/auth.middleware.js"
import { createLeader, deleteLeader, getAllLeaders, getLeaderById, updateLeader } from "../controller/leader.controller.js"
const router = express.Router()


router.post("/create", isAuthenticated, isAuthorized("Admin"), createLeader)
router.get("/getAll",  getAllLeaders)
router.get("/get/:id", sgetLeaderById)
router.put("/update/:id", isAuthenticated, isAuthorized("Admin"), updateLeader)
router.delete("/delete/:id", isAuthenticated, isAuthorized("Admin"), deleteLeader)


export default router