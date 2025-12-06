import mongoose from "mongoose";

const heroSchema = new mongoose.Schema(
  {
    image: {
      type: String, // URL of uploaded file
      required: true,
    },
  },
  { timestamps: true }
);

const Hero = mongoose.model("Hero", heroSchema);
export default Hero;
