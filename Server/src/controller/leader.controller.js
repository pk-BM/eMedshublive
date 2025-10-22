import { sendResponse } from "../utils/sendResponse.js"
import Leader from "../models/leader.model.js"
import mongoose from "mongoose"

export const createLeader = async (req, res) => {
    const { profilePicture, name, designation, previous, institution, department, bio } = req.body

    try {
        if (!name || !profilePicture || !designation || !previous || !institution || !department || !bio) {
            return sendResponse(res, 400, false, "All fields are required", null)
        }
        const leader = await Leader.create(req.body)
        return sendResponse(res, 201, true, "Leader created successfully", leader)
    } catch (error) {
        console.error("Error in createLeader controller:", error)
        return sendResponse(res, 500, false, error.message || "Internal Server Error", null)
    }
}

export const getAllLeaders = async (req, res) => {
    try {
        const leaders = await Leader.find().sort({ createdAt: -1 })
        if (!leaders || leaders.length === 0) {
            return sendResponse(res, 404, false, "No leaders data found", null)
        }
        return sendResponse(res, 200, true, "Leaders fetched successfully", leaders)
    } catch (error) {
        console.error("Error in getAllLeaders controller:", error)
        return sendResponse(res, 500, false, error.message || "Internal Server Error", null)
    }
}

export const getLeaderById = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return sendResponse(res, 400, false, "ID required", null)
        }
        if (!mongoose.isValidObjectId(id)) {
            return sendResponse(res, 400, false, "Invalid ID", null)
        }
        const leader = await Leader.findById(id)
        if (!leader) {
            return sendResponse(res, 404, false, "Leader not found", null)
        }
        return sendResponse(res, 200, true, "Leader fetched successfully", leader)
    } catch (error) {
        console.error("Error in getLeaderById controller:", error)
        return sendResponse(res, 500, false, error.message || "Internal Server Error", null)
    }
}

export const updateLeader = async (req, res) => {
    const { id } = req.params
    const { profilePicture, name, designation, previous, institution, department, bio } = req.body
    try {
        if (!id) return sendResponse(res, 400, false, "Id required", null)
        if (!mongoose.isValidObjectId(id)) return sendResponse(res, 400, false, "Invalid ID", null)
        if (!name || !profilePicture || !designation || !previous || !institution || !department || !bio)
            return sendResponse(res, 400, false, "All fields are required", null)

        const leader = await Leader.findById(id)
        if (!leader) return sendResponse(res, 404, false, "Leader not found", null)

        const updatedLeader = await Leader.findByIdAndUpdate(id, req.body, { new: true })
        return sendResponse(res, 200, true, "Leader updated successfully", updatedLeader)
    } catch (error) {
        console.error("Error in updateLeader controller:", error)
        return sendResponse(res, 500, false, error.message || "Internal Server Error", null)
    }
}

export const deleteLeader = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) return sendResponse(res, 400, false, "Id required", null)
        if (!mongoose.isValidObjectId(id)) return sendResponse(res, 400, false, "Invalid ID", null)

        const deletedLeader = await Leader.findByIdAndDelete(id)
        if (!deletedLeader) return sendResponse(res, 404, false, "Leader not found", null)

        return sendResponse(res, 200, true, "Leader deleted successfully", null)
    } catch (error) {
        console.error("Error in deleteLeader controller:", error)
        return sendResponse(res, 500, false, error.message || "Internal Server Error", null)
    }
}
