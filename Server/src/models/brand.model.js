import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    productType: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    allopathicOrHerbal: {
      type: String,
      enum: ["Allopathic", "Herbal"],
    },
    generic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Generic",
      required: true,
    },
    manufacturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pharmaceutical",
      required: true,
    },
    dosageForm: {
      type: String,
    },
    strength: {
      type: String,
    },
    packSize: {
      type: String,
    },
    unitPrice: {
      type: Number,
    },
    totalPrice: {
      type: Number,
    },
    packImage: {
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

export default mongoose.model("Brand", brandSchema);
