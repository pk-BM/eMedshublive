import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { GetGenericById, UpdateGeneric } from "../../../lib/APIs/genericAPI";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { toast } from "react-toastify";

const RichTextEditor = React.memo(({ field, label, value, onChange }) => {
  const { quill, quillRef } = useQuill();

  const memoizedOnChange = useCallback(
    (content) => {
      onChange(field, content);
    },
    [field, onChange]
  );

  useEffect(() => {
    if (quill) {
      const currentContent = quill.root.innerHTML.trim();

      if (
        value !== currentContent &&
        value !== "<p><br></p>" &&
        typeof value === "string"
      ) {
        quill.clipboard.dangerouslyPasteHTML(value || "");
      }

      const handleTextChange = () => {
        memoizedOnChange(quill.root.innerHTML);
      };

      quill.on("text-change", handleTextChange);

      return () => {
        quill.off("text-change", handleTextChange);
      };
    }
  }, [quill, memoizedOnChange]);

  return (
    <div className="mb-6">
      <label className="block mb-2 text-gray-700 font-medium">{label}</label>
      <div ref={quillRef} className="border bg-white h-64" />
    </div>
  );
});

const AdminUpdateGenerics = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);

  const [originalFileUrl, setOriginalFileUrl] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchGeneric = async () => {
      setDataLoading(true);
      try {
        const response = await GetGenericById(id);
        const fetchedData = response.data;

        setOriginalFileUrl(fetchedData.innovatorMonograph || null);

        setFormData({
          name: fetchedData.name || "",
          file: fetchedData.innovatorMonograph || null,
          image: fetchedData.structureImage || null,
          indication: fetchedData.indication || "",
          composition: fetchedData.composition || "",
          pharmacology: fetchedData.pharmacology || "",
          dosageAndAdministration: fetchedData.dosageAndAdministration || "",
          interaction: fetchedData.interaction || "",
          contraindication: fetchedData.contraindication || "",
          sideEffect: fetchedData.sideEffect || "",
          pregnancyAndLactation: fetchedData.pregnancyAndLactation || "",
          overdoseEffect: fetchedData.overdoseEffect || "",
          therapeuticClass: fetchedData.therapeuticClass || "",
          storageCondition: fetchedData.storageCondition || "",
          isActive: fetchedData.isActive ?? true,
          allopathicOrHerbal: fetchedData?.allopathicOrHerbal || "",
        });

        setPreviewImage(fetchedData.structureImage || null);
      } catch (error) {
        console.error("Error fetching generic:", error);
        toast.error("Failed to load generic data.");
      } finally {
        setDataLoading(false);
      }
    };
    fetchGeneric();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      if (name === "image" && file) {
        setPreviewImage(URL.createObjectURL(file));
      } else if (name === "image" && !file) {
        setPreviewImage(formData.image || null);
      }
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRichTextChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData) return;

    try {
      setLoading(true);
      const response = await UpdateGeneric(id, formData);
      toast.success(response.message || "Generic updated successfully!");
      setTimeout(() => navigate("/admin/generic"), 400);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update generic");
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">Loading generic data...</p>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-red-600">
          Error: Could not load generic data.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex justify-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-8 my-10 border border-gray-200">
        <h1 className="text-3xl font-semibold text-black mb-6 border-b-2 border-tertiary pb-2">
          Update Generic: {formData.name}
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
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-black font-medium mb-2">
                Innovator Monograph
              </label>
              <input
                type="file"
                accept="application/*"
                name="file"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 text-black cursor-pointer"
              />

              {formData.file instanceof File && (
                <div className="mt-2 text-sm text-green-600 font-semibold">
                  New file selected: {formData.file.name} (Ready to upload)
                </div>
              )}
            </div>

            <div>
              <label className="block text-black font-medium mb-2">
                Structure Image
              </label>
              <input
                type="file"
                accept="image/*"
                name="image"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 text-black cursor-pointer"
              />

              {/* Image Preview */}
              {previewImage && (
                <div className="mt-4">
                  <div className="mt-2 mb-2 text-sm text-gray-700">
                    {previewImage === formData.image
                      ? "Current Image Preview"
                      : "New Image Preview"}
                  </div>
                  <img
                    src={previewImage}
                    alt="Structure Preview"
                    className="w-full max-h-48 object-contain rounded-lg border border-gray-300"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-black font-medium mb-2">
              Allopathic or Herbal
            </label>
            <select
              name="allopathicOrHerbal"
              value={formData.allopathicOrHerbal}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
              required
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
              value={formData.therapeuticClass || ""}
              onChange={handleChange}
              placeholder="Enter therapeutic class"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
            />
          </div>

          <RichTextEditor
            field="indication"
            label="Indication"
            value={formData.indication}
            onChange={handleRichTextChange}
          />
          <RichTextEditor
            field="composition"
            label="Composition"
            value={formData.composition}
            onChange={handleRichTextChange}
          />
          <RichTextEditor
            field="pharmacology"
            label="Pharmacology"
            value={formData.pharmacology}
            onChange={handleRichTextChange}
          />
          <RichTextEditor
            field="dosageAndAdministration"
            label="Dosage and Administration"
            value={formData.dosageAndAdministration}
            onChange={handleRichTextChange}
          />
          <RichTextEditor
            field="interaction"
            label="Interaction"
            value={formData.interaction}
            onChange={handleRichTextChange}
          />
          <RichTextEditor
            field="contraindication"
            label="Contraindication"
            value={formData.contraindication}
            onChange={handleRichTextChange}
          />
          <RichTextEditor
            field="sideEffect"
            label="Side Effect"
            value={formData.sideEffect}
            onChange={handleRichTextChange}
          />
          <RichTextEditor
            field="pregnancyAndLactation"
            label="Pregnancy and Lactation"
            value={formData.pregnancyAndLactation}
            onChange={handleRichTextChange}
          />
          <RichTextEditor
            field="overdoseEffect"
            label="Overdose Effect"
            value={formData.overdoseEffect}
            onChange={handleRichTextChange}
          />
          <RichTextEditor
            field="storageCondition"
            label="Storage Condition"
            value={formData.storageCondition}
            onChange={handleRichTextChange}
          />

          {/* Active Toggle */}
          <div className="flex items-center gap-3">
            <input
              id="isActive"
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <label htmlFor="isActive" className="text-black">
              Active
            </label>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-bg text-white py-2 px-6 rounded-lg cursor-pointer"
              disabled={loading || dataLoading}
            >
              {loading ? "Updating..." : "Update Generic"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdateGenerics;
