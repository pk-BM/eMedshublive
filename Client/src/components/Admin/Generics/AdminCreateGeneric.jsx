import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { CreateGeneric, GetGenerics } from "../../../lib/APIs/genericAPI";
import { toast } from "react-toastify";
import { GetAllBrands } from "../../../lib/APIs/brandsAPI";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

// ----------- RICH TEXT EDITOR COMPONENT -----------
const RichTextEditor = React.memo(({ field, label, value, onChange }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "color",
    "background",
  ];

  const { quill, quillRef } = useQuill({ modules, formats, theme: "snow" });

  useEffect(() => {
    if (quill) {
      // Set initial content
      if (value && quill.root.innerHTML !== value) {
        quill.root.innerHTML = value;
      }

      // Handle text changes
      quill.on("text-change", () => {
        const html = quill.root.innerHTML;
        onChange(field, html === "<p><br></p>" ? "" : html);
      });
    }
  }, [quill, field, onChange, value]);

  return (
    <div className="mb-6">
      <label className="block mb-2 text-gray-700 font-medium">{label}</label>
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
        <div ref={quillRef} className="min-h-[150px]" />
      </div>
    </div>
  );
});
// ----------------------------------------------------------------

const AdminCreateGeneric = () => {
  const [allBrandsData, setAllBrandsData] = useState([]);
  const [searchBrand, setSearchBrand] = useState("");

  const [otherCombinationsData, setOtherCombinationsData] = useState([]);
  const [searchOtherCombinations, setSearchOtherCombinations] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    file: null,
    image: null,
    allopathicOrHerbal: "",
    indication: "",
    pharmacology: "",
    dosageAndAdministration: "",
    interaction: "",
    contraindication: "",
    sideEffect: "",
    pregnancyAndLactation: "",
    overdoseEffect: "",
    therapeuticClass: "",
    storageCondition: "",
    availableBrands: [], // array of brand IDs
    otherCombinations: []
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
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle rich text editor changes
  const handleRichTextChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const toggleBrand = (id) => {
    setFormData((prev) => {
      const isSelected = prev.availableBrands.includes(id);
      return {
        ...prev,
        availableBrands: isSelected
          ? prev.availableBrands.filter((b) => b !== id)
          : [...prev.availableBrands, id],
      };
    });
  };
  const toggleOtherCombinations = (id) => {
    setFormData((prev) => {
      const isSelected = prev.otherCombinations.includes(id);
      return {
        ...prev,
        otherCombinations: isSelected
          ? prev.otherCombinations.filter((b) => b !== id)
          : [...prev.otherCombinations, id],
      };
    });
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

  const fetchAllBrands = async () => {
    try {
      const response = await GetAllBrands();
      setAllBrandsData(response.data);

      // prefill if needed
      setFormData((prev) => ({
        ...prev,
        availableBrands: [],
      }));
    } catch (error) {
      console.log(error);
    }
  };
  const fetchAllOtherCombinations = async () => {
    try {
      const response = await GetGenerics();
      setOtherCombinationsData(response.data);

      // prefill if needed
      setFormData((prev) => ({
        ...prev,
        otherCombinations: [],
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllBrands();
    fetchAllOtherCombinations()
  }, []);

  const filteredBrands = allBrandsData.filter((b) =>
    b.name.toLowerCase().includes(searchBrand.toLowerCase())
  );

  const filteredOtherCombinations = otherCombinationsData.filter((b) => b.name.toLowerCase().includes(searchOtherCombinations.toLowerCase()));

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
              className="w-full border border-gray-300 rounded-lg p-3 text-black focus:outline-none focus:ring-2 focus:ring-bg focus:border-transparent transition-all duration-200"
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
                className="w-full border border-gray-300 rounded-lg p-3 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200"
              />
              {pdfName && (
                <div className="text-sm mt-2 text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-200">
                  {pdfName}
                </div>
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
                className="w-full border border-gray-300 rounded-lg p-3 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200"
              />
              {previewImage && (
                <div className="mt-4 p-2 border border-gray-200 rounded-lg bg-gray-50">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full max-h-48 object-contain rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Allopathic or Herbal */}
          <div>
            <label className="block text-black font-medium mb-2">
              Allopathic or Herbal
            </label>
            <select
              required
              name="allopathicOrHerbal"
              value={formData.allopathicOrHerbal}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 text-black focus:outline-none focus:ring-2 focus:ring-bg focus:border-transparent transition-all duration-200 cursor-pointer"
            >
              <option value="">Select Type</option>
              <option value="Allopathic">Allopathic</option>
              <option value="Herbal">Herbal</option>
            </select>
          </div>

          {/* Brands - CUSTOM MULTI SELECT */}
          <div>
            <label className="block text-black font-medium mb-2">Brands</label>

            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search brand..."
              className="w-full border border-gray-300 rounded-lg p-3 mb-3 text-black focus:outline-none focus:ring-2 focus:ring-bg focus:border-transparent transition-all duration-200"
              value={searchBrand}
              onChange={(e) => setSearchBrand(e.target.value)}
            />

            {/* Scrollable List */}
            <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2 bg-gray-50">
              {filteredBrands.length === 0 ? (
                <p className="text-gray-500 text-sm py-2 text-center">No brands found</p>
              ) : (
                filteredBrands.map((brand) => (
                  <label
                    key={brand._id}
                    className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-all duration-200 ${
                      formData.availableBrands.includes(brand._id)
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-bg"
                      checked={formData.availableBrands.includes(brand._id)}
                      onChange={() => toggleBrand(brand._id)}
                    />
                    <span className="text-black">{brand.name}</span>
                  </label>
                ))
              )}
            </div>

            <p className="text-gray-600 text-sm mt-2">
              Selected: <span className="font-medium text-black">{formData.availableBrands.length}</span>
            </p>
          </div>

          {/* ---------------- */}


          {/* Other Combinations - CUSTOM MULTI SELECT */}
          <div>
            <label className="block text-black font-medium mb-2">Other Combinations</label>

            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search other combinations ..."
              className="w-full border border-gray-300 rounded-lg p-3 mb-3 text-black focus:outline-none focus:ring-2 focus:ring-bg focus:border-transparent transition-all duration-200"
              value={searchOtherCombinations}
              onChange={(e) => setSearchOtherCombinations(e.target.value)}
            />

            {/* Scrollable List */}
            <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2 bg-gray-50">
              {filteredOtherCombinations.length === 0 ? (
                <p className="text-gray-500 text-sm py-2 text-center">No other combinations found</p>
              ) : (
                filteredOtherCombinations.map((generic) => (
                  <label
                    key={generic._id}
                    className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-all duration-200 ${
                      formData.otherCombinations.includes(generic._id)
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-bg"
                      checked={formData.otherCombinations.includes(generic._id)}
                      onChange={() => toggleOtherCombinations(generic._id)}
                    />
                    <span className="text-black">{generic.name}</span>
                  </label>
                ))
              )}
            </div>

            <p className="text-gray-600 text-sm mt-2">
              Selected: <span className="font-medium text-black">{formData.otherCombinations.length}</span>
            </p>
          </div>

          {/* ---------------- */}

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
              className="w-full border border-gray-300 rounded-lg p-3 text-black focus:outline-none focus:ring-2 focus:ring-bg focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Rich Text Editors */}
          <RichTextEditor
            field="indication"
            label="Indication"
            value={formData.indication}
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

          {/* Submit */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-bg text-white py-3 px-8 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </span>
              ) : (
                "Create Generic"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateGeneric;
