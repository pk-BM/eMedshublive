import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { GetGenericById, GetGenerics, UpdateGeneric } from "../../../lib/APIs/genericAPI";
import { GetAllBrands } from "../../../lib/APIs/brandsAPI";
import { toast } from "react-toastify";
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

const AdminUpdateGenerics = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [allBrandsData, setAllBrandsData] = useState([]);
  const [searchBrand, setSearchBrand] = useState("");

  const [otherCombinationsData, setOtherCombinationsData] = useState([]);
  const [searchOtherCombinations, setSearchOtherCombinations] = useState("");


  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch Generic
  useEffect(() => {
    const fetchGeneric = async () => {
      setDataLoading(true);
      try {
        const response = await GetGenericById(id);
        const fetchedData = response.data;

        setFormData({
          name: fetchedData.name || "",
          file: null,
          image: null,
          indication: fetchedData.indication || "",
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
          allopathicOrHerbal: fetchedData.allopathicOrHerbal || "",
          availableBrands: (fetchedData.availableBrands || []).map(
            (b) => b._id
          ),
          otherCombinations: (fetchedData.otherCombinations || []).map(
            (b) => b._id
          ),
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

  // Fetch all brands
  useEffect(() => {
    const fetchAllBrands = async () => {
      try {
        const response = await GetAllBrands();
        setAllBrandsData(response.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    fetchAllBrands();
  }, []);

  useEffect(() => {
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
    fetchAllOtherCombinations()
  }, [])

  // Handle text, file, checkbox changes
  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      if (name === "image" && file) setPreviewImage(URL.createObjectURL(file));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle rich text editor changes
  const handleRichTextChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Toggle availableBrands selection
  const toggleBrand = (brandId) => {
    setFormData((prev) => {
      const isSelected = prev.availableBrands.includes(brandId);
      return {
        ...prev,
        availableBrands: isSelected
          ? prev.availableBrands.filter((b) => b !== brandId)
          : [...prev.availableBrands, brandId],
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

  const filteredBrands = allBrandsData.filter((b) =>
    b.name.toLowerCase().includes(searchBrand.toLowerCase())
  );

  const filteredOtherCombinations = otherCombinationsData.filter((b) => b.name.toLowerCase().includes(searchOtherCombinations.toLowerCase()));


  if (dataLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-bg rounded-full animate-spin"></div>
          <p className="text-xl text-gray-600">Loading generic data...</p>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-red-200">
          <p className="text-xl text-red-600">
            Error: Could not load generic data.
          </p>
        </div>
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
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-bg focus:border-transparent text-black transition-all duration-200"
              required
            />
          </div>

          {/* File & Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-black font-medium mb-2">
                Innovator Monograph
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="application/*"
                  name="file"
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 text-black cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200"
                />
              </div>
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
                className="w-full border border-gray-300 rounded-lg p-3 text-black cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200"
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

          {/* Allopathic / Herbal */}
          <div>
            <label className="block text-black font-medium mb-2">
              Allopathic or Herbal
            </label>
            <select
              name="allopathicOrHerbal"
              value={formData.allopathicOrHerbal}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-bg focus:border-transparent text-black transition-all duration-200 cursor-pointer"
              required
            >
              <option value="">Select Type</option>
              <option value="Allopathic">Allopathic</option>
              <option value="Herbal">Herbal</option>
            </select>
          </div>

          {/* Brands */}
          <div>
            <label className="block text-black font-medium mb-2">Brands</label>
            <input
              type="text"
              placeholder="Search brand..."
              className="w-full border border-gray-300 rounded-lg p-3 mb-3 text-black focus:outline-none focus:ring-2 focus:ring-bg focus:border-transparent transition-all duration-200"
              value={searchBrand}
              onChange={(e) => setSearchBrand(e.target.value)}
            />
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
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-bg focus:border-transparent text-black transition-all duration-200"
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

          {/* Active Toggle */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="isActive"
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-bg rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
            <label htmlFor="isActive" className="text-black font-medium cursor-pointer">
              {formData.isActive ? "Active" : "Inactive"}
            </label>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-bg text-white py-3 px-8 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
              disabled={loading || dataLoading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </span>
              ) : (
                "Update Generic"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdateGenerics;
