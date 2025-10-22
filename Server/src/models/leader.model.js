import mongoose from "mongoose";

const leaderSchema = new mongoose.Schema({

    profilePicture: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    previous: {
        type: String,
        required: true
    },
    institution: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Leader = mongoose.model("Leader", leaderSchema);
export default Leader