import mongoose from "mongoose";

const pharmaceuticalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
    },
    totalGenerics: {
      type: Number,
      default: 0,
    },
    contactDetails: {
      type: String,
    },
    address: {
      type: String,
    },
    mapLink: {
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

const Pharmaceutical = mongoose.model("Pharmaceutical", pharmaceuticalSchema);
export default Pharmaceutical;
