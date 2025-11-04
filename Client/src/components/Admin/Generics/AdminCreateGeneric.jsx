import React, { useState, useCallback } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { CreateGeneric } from "../../../lib/APIs/genericAPI"; // adjust path if needed
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

      if (value !== currentContent && value !== "<p><br></p>") {
        quill.clipboard.dangerouslyPasteHTML(value || "");
      }

      const handleTextChange = () => {
        memoizedOnChange(quill.root.innerHTML);
      };

      // Listener lagao
      quill.on("text-change", handleTextChange);

      // 3. Cleanup:
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

const AdminCreateGeneric = () => {
  const [formData, setFormData] = useState({
    name: "",
    file: null, // PDF file
    image: null, // image file
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
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRichTextChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
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
      console.error(error);
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

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
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
              required
            />
          </div>

          {/* Innovator Monograph (PDF) */}
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
              {pdfName && (
                <div className="mt-2 text-sm text-gray-700">{pdfName}</div>
              )}
            </div>

            {/*Structure Image */}
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
              {previewImage && (
                <div className="mt-4">
                  <img
                    src={previewImage}
                    alt="Structure Preview"
                    className="w-full max-h-48 object-contain rounded-lg border border-gray-300"
                  />
                </div>
              )}
            </div>
          </div>

          {/* allophaticOrHerbal */}

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
              <option value="Herbal"
              >Herbal</option>
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
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
            />
          </div>

          {/* Rich Text Fields (Ab 'handleRichTextChange' use kiya hai) */}
          {/* Indication */}
          <RichTextEditor
            field="indication"
            label="Indication" // Label capitalize kiya
            value={formData.indication}
            onChange={handleRichTextChange} // Memoized handler
          />

          {/* Composition */}
          <RichTextEditor
            field="composition" // Field name small letter
            label="Composition" // Label capitalize kiya
            value={formData.composition}
            onChange={handleRichTextChange}
          />

          {/* Pharmacology */}
          <RichTextEditor
            field="pharmacology"
            label="Pharmacology"
            value={formData.pharmacology}
            onChange={handleRichTextChange}
          />

          {/* Dosage and Administration */}
          <RichTextEditor
            field="dosageAndAdministration"
            label="Dosage and Administration" // Label thik kiya
            value={formData.dosageAndAdministration}
            onChange={handleRichTextChange}
          />

          {/* Interaction */}
          <RichTextEditor
            field="interaction"
            label="Interaction"
            value={formData.interaction}
            onChange={handleRichTextChange}
          />

          {/* Contraindication */}
          <RichTextEditor
            field="contraindication"
            label="Contraindication"
            value={formData.contraindication}
            onChange={handleRichTextChange}
          />

          {/* Side Effects */}
          <RichTextEditor
            field="sideEffect"
            label="Side Effect" // Label thik kiya
            value={formData.sideEffect}
            onChange={handleRichTextChange}
          />

          {/* Pregnancy & Lactation */}
          <RichTextEditor
            field="pregnancyAndLactation"
            label="Pregnancy and Lactation" // Label thik kiya
            value={formData.pregnancyAndLactation}
            onChange={handleRichTextChange}
          />

          {/* Overdose Effect */}
          <RichTextEditor
            field="overdoseEffect"
            label="Overdose Effect" // Label thik kiya
            value={formData.overdoseEffect}
            onChange={handleRichTextChange}
          />

          {/* Storage Condition */}
          <RichTextEditor
            field="storageCondition"
            label="Storage Condition" // Label thik kiya
            value={formData.storageCondition}
            onChange={handleRichTextChange}
          />

          {/* Submit */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-bg text-white py-2 px-6 rounded-lg cursor-pointer"
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
