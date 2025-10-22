import mongoose from "mongoose";

const trustedCenterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
        required: true,
    }
}, { timestamps: true })

const TrustedCenter = mongoose.model("TrustedCenter", trustedCenterSchema)

export default TrustedCenter