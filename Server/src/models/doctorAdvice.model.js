import mongoose from "mongoose";

const doctorAdviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String, // video URL or uploaded video
    },
    image: {
      type: String,
    },
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

export default mongoose.model("DoctorAdvice", doctorAdviceSchema);
