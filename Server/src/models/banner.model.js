import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    bannerImgUrl: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      enum: ["horizontal", "vertical"],
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },
  },
  { timestamps: true }
);

const Banner = mongoose.model("Banner", bannerSchema);
export default Banner;
