import mongoose from "mongoose";

const genericSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    innovatorMonograph: {
      type: String, // PDF file URL
    },
    allophaticOrHerbal: {
      type: String,
      enum: ["Allopathic", "Herbal"],
    },
    structureImage: {
      type: String, // image URL
    },
    indication: {
      type: String,
    },
    composition: {
      type: String,
    },
    pharmacology: {
      type: String,
    },
    dosageAndAdministration: {
      type: String,
    },
    interaction: {
      type: String,
    },
    contraindication: {
      type: String,
    },
    sideEffect: {
      type: String,
    },
    pregnancyAndLactation: {
      type: String,
    },
    overdoseEffect: {
      type: String,
    },
    therapeuticClass: {
      type: String,
    },
    storageCondition: {
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

const Generic = mongoose.model("Generic", genericSchema);

export default Generic;
