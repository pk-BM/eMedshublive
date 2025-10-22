import mongoose from "mongoose";

const medicalTestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
    trustedCenters: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "TrustedCenter"
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },
  },
  { timestamps: true }
);

export default mongoose.model("MedicalTest", medicalTestSchema);
