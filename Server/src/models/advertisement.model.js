import mongoose from "mongoose";

const advertisementSchema = new mongoose.Schema(
  {
    organization: {
      type: String,
      required: true,
    },
    position: {
      type: String, // provide enum here, and use dropdown from frontend
    },
    image: {
      type: String,
    },
    title: {
      type: String,
    },
    link: {
      type: String,
    },
    publishedDate: {
      type: Date,
    },
    unpublishedDate: {
      type: Date,
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

  export default mongoose.model("Advertisement", advertisementSchema);
