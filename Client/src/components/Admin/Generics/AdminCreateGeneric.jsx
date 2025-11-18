import React, { useState } from "react";
import { useNavigate } from "react-router";
import { CreateGeneric } from "../../../lib/APIs/genericAPI";
import { toast } from "react-toastify";

const AdminCreateGeneric = () => {
  const [formData, setFormData] = useState({
    name: "",
    file: null,
    image: null,
    allopathicOrHerbal: "",
    indication: "",
    composition: "",
    pharmacology: "",
    dosageAndAdministration: "",
    interaction: "",
    contraindication: "",
    sideEffect: "",
    pregnancyAndLactation: "",
    overdoseEffect: "",
    therapeuticClass: "",
    storageCondition: "",
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [pdfName, setPdfName] = useState("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));

      if (name === "image" && file) {
        setPreviewImage(URL.createObjectURL(file));
      }
      if (name === "file" && file) {
        setPdfName(file.name);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await CreateGeneric(formData);
      toast.success(response.message);
      setTimeout(() => navigate("/admin/generic"), 400);
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // Reusable textarea component
  const RenderTextarea = ({ name, label }) => (
    <div>
      <label className="block text-black font-medium mb-2">{label}</label>
      <textarea
        name={name}
        value={formData[name]}
        onChange={handleChange}
        rows={6}
        className="w-full border border-gray-300 rounded-lg p-3 text-black bg-white"
      ></textarea>
    </div>
  );

  return (
    <div className="w-full min-h-screen flex justify-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-8 my-10 border border-gray-200">
        <h1 className="text-3xl font-semibold text-black mb-6 border-b-2 border-tertiary pb-2">
          Create Generic
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Name */}
          <div>
            <label className="block text-black font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter generic name"
              className="w-full border border-gray-300 rounded-lg p-3 text-black"
              required
            />
          </div>

          {/* PDF + Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PDF */}
            <div>
              <label className="block text-black font-medium mb-2">
                Innovator Monograph (PDF)
              </label>
              <input
                type="file"
                accept="application/*"
                name="file"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3"
              />
              {pdfName && (
                <div className="text-sm mt-2 text-gray-700">{pdfName}</div>
              )}
            </div>

            {/* Image */}
            <div>
              <label className="block text-black font-medium mb-2">
                Structure Image
              </label>
              <input
                type="file"
                accept="image/*"
                name="image"
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-3"
              />
              {previewImage && (
                <div className="mt-4">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full max-h-48 object-contain border rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Select */}
          <div>
            <label className="block text-black font-medium mb-2">
              Allopathic or Herbal
            </label>
            <select
              required
              name="allopathicOrHerbal"
              value={formData.allopathicOrHerbal}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 text-black"
            >
              <option value="">Select Type</option>
              <option value="Allopathic">Allopathic</option>
              <option value="Herbal">Herbal</option>
            </select>
          </div>

          {/* Therapeutic Class */}
          <div>
            <label className="block text-black font-medium mb-2">
              Therapeutic Class
            </label>
            <input
              type="text"
              name="therapeuticClass"
              value={formData.therapeuticClass}
              onChange={handleChange}
              placeholder="Enter therapeutic class"
              className="w-full border border-gray-300 rounded-lg p-3 text-black"
            />
          </div>

          {/* TEXTAREAS (REPLACED QUILL) */}
          <RenderTextarea name="indication" label="Indication" />
          <RenderTextarea name="composition" label="Composition" />
          <RenderTextarea name="pharmacology" label="Pharmacology" />
          <RenderTextarea
            name="dosageAndAdministration"
            label="Dosage and Administration"
          />
          <RenderTextarea name="interaction" label="Interaction" />
          <RenderTextarea name="contraindication" label="Contraindication" />
          <RenderTextarea name="sideEffect" label="Side Effect" />
          <RenderTextarea
            name="pregnancyAndLactation"
            label="Pregnancy and Lactation"
          />
          <RenderTextarea name="overdoseEffect" label="Overdose Effect" />
          <RenderTextarea name="storageCondition" label="Storage Condition" />

          {/* Submit */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-bg text-white py-2 px-6 rounded-lg"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Generic"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateGeneric;
