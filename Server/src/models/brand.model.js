import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    // Basic Brand Information
    name: {
      type: String,
      required: true,
      trim: true,
    },
    productType: {
      type: String,
      required: true,
    },
    generic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Generic",
      required: true,
    },
    strength: {
      type: String,
    },
    manufacturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pharmaceutical",
      required: true,
    },
    unitPrice: {
      type: Number,
    },
    stripPrice: {
      type: Number,
    },
    totalPrice: {
      type: Number,
    },
    alternateBrands: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
      },
    ],
    packImage: {
      type: String,
    },
    allopathicOrHerbal: {
      type: String,
      enum: ["Allopathic", "Herbal"],
    },

    // Additional fields
    dosageForm: {
      type: String,
    },
    packSize: {
      type: String,
    },
    newProduct: {
      type: String,
      enum: ["yes", "no"],
    },
    bioequivalentDrug: {
      type: String,
      enum: ["yes", "no"],
    },

    // Medical / Informational Fields
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
    precautionsAndWarnings: {
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
    commonQuestions: {
      type: String,
    },

    // Status and metadata
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
