import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { CreateGeneric, GetGenerics } from "../../../lib/APIs/genericAPI";
import { toast } from "react-toastify";
import { GetAllBrands } from "../../../lib/APIs/brandsAPI";

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

  // Custom Textarea Component
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
              className="w-full border border-gray-300 rounded-lg p-3 text-black"
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
              className="w-full border border-gray-300 rounded-lg p-3 mb-3 text-black"
              value={searchBrand}
              onChange={(e) => setSearchBrand(e.target.value)}
            />

            {/* Scrollable List */}
            <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2 bg-gray-50">
              {filteredBrands.length === 0 ? (
                <p className="text-gray-500 text-sm">No brands found</p>
              ) : (
                filteredBrands.map((brand) => (
                  <label
                    key={brand._id}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={formData.availableBrands.includes(brand._id)}
                      onChange={() => toggleBrand(brand._id)}
                    />
                    <span className="text-black">{brand.name}</span>
                  </label>
                ))
              )}
            </div>

            <p className="text-gray-600 text-sm mt-2">
              Selected: {formData.availableBrands.length}
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
              className="w-full border border-gray-300 rounded-lg p-3 mb-3 text-black"
              value={searchOtherCombinations}
              onChange={(e) => setSearchOtherCombinations(e.target.value)}
            />

            {/* Scrollable List */}
            <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2 bg-gray-50">
              {filteredOtherCombinations.length === 0 ? (
                <p className="text-gray-500 text-sm">No other combinations found</p>
              ) : (
                filteredOtherCombinations.map((generic) => (
                  <label
                    key={generic._id}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={formData.otherCombinations.includes(generic._id)}
                      onChange={() => toggleOtherCombinations(generic._id)}
                    />
                    <span className="text-black">{generic.name}</span>
                  </label>
                ))
              )}
            </div>

            <p className="text-gray-600 text-sm mt-2">
              Selected: {formData.otherCombinations.length}
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
              className="w-full border border-gray-300 rounded-lg p-3 text-black"
            />
          </div>

          {/* TEXTAREAS */}
          <RenderTextarea name="indication" label="Indication" />
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
