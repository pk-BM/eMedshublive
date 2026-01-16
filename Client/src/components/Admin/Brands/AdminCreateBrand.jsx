import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { CreateBrand, GetBrandOptions } from "../../../lib/APIs/brandsAPI";
import { GenericOptions } from "../../../lib/APIs/genericAPI";
import { PharmaceuticalOptions } from "../../../lib/APIs/pharmaceuticalAPI";
import { toast } from "react-toastify";

const RenderTextarea = ({ name, label, value, onChange, rows = 4 }) => (
  <div>
    <label className="block text-black font-medium mb-2">{label}</label>
    <textarea
      name={name}
      value={value}
      onInput={onChange}
      rows={rows}
      className="w-full border border-gray-300 rounded-lg p-3 text-black bg-white focus:outline-none focus:ring-2 focus:ring-tertiary"
    ></textarea>
  </div>
);

const AdminCreateBrand = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Basic Information
    name: "",
    productType: "",
    generic: "",
    strength: "",
    manufacturer: "",
    unitPrice: "",
    stripPrice: "",
    totalPrice: "",
    packImage: null,
    allopathicOrHerbal: "",
    dosageForm: "",
    packSize: "",
    newProduct: "",
    bioequivalentDrug: "",
    alternateBrands: [],
    // Medical / Informational Fields
    indication: "",
    composition: "",
    pharmacology: "",
    dosageAndAdministration: "",
    interaction: "",
    contraindication: "",
    sideEffect: "",
    pregnancyAndLactation: "",
    precautionsAndWarnings: "",
    overdoseEffect: "",
    therapeuticClass: "",
    storageCondition: "",
    commonQuestions: "",
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingOptions, setFetchingOptions] = useState(false);

  const [genericOptions, setGenericOptions] = useState([]);
  const [manufacturerOptions, setManufacturerOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [searchAlternateBrands, setSearchAlternateBrands] = useState("");

  // Fetch dropdown data
  const fetchDropdownData = async () => {
    try {
      setFetchingOptions(true);

      const [genericRes, manufacturerRes, brandRes] = await Promise.all([
        GenericOptions(),
        PharmaceuticalOptions(),
        GetBrandOptions(),
      ]);

      setGenericOptions(Array.isArray(genericRes.data) ? genericRes.data : []);
      setManufacturerOptions(
        Array.isArray(manufacturerRes.data) ? manufacturerRes.data : []
      );
      setBrandOptions(Array.isArray(brandRes.data) ? brandRes.data : []);
    } catch (err) {
      console.error("Error fetching dropdown data:", err);
      toast.error(err.response?.data?.message || "Failed to fetch dropdowns");
    } finally {
      setFetchingOptions(false);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, packImage: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const toggleAlternateBrand = (id) => {
    setFormData((prev) => {
      const isSelected = prev.alternateBrands.includes(id);
      return {
        ...prev,
        alternateBrands: isSelected
          ? prev.alternateBrands.filter((b) => b !== id)
          : [...prev.alternateBrands, id],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await CreateBrand(formData);
      toast.success(response.message || "Brand created successfully!");

      setTimeout(() => navigate("/admin/brands"), 600);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Render options for dropdowns
  const renderOptions = (data, label) => {
    if (fetchingOptions) return <option>Loading {label}...</option>;
    if (!data.length) return <option>No {label} available</option>;

    return data.map((item) => (
      <option key={item._id} value={item._id}>
        {item.name}
      </option>
    ));
  };

  const filteredBrandOptions = brandOptions.filter((b) =>
    b.name.toLowerCase().includes(searchAlternateBrands.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen flex justify-center bg-gray-100 px-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-4 sm:p-8 my-6 sm:my-10 border border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-semibold text-black mb-6 sm:mb-8 border-b-2 border-tertiary pb-2">
          Create Brand
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Section: Basic Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-black font-medium mb-2">
                  Brand Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter brand name"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-tertiary text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-black font-medium mb-2">
                  Type of Brand <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="productType"
                  value={formData.productType}
                  onChange={handleChange}
                  placeholder="e.g., Tablet, Capsule, Syrup"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-tertiary text-black"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4">
              <div>
                <label className="block text-black font-medium mb-2">
                  Generic <span className="text-red-500">*</span>
                </label>
                <select
                  name="generic"
                  value={formData.generic}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-tertiary text-black"
                  required
                >
                  <option value="">Select Generic</option>
                  {renderOptions(genericOptions, "Generics")}
                </select>
              </div>

              <div>
                <label className="block text-black font-medium mb-2">
                  Strength
                </label>
                <input
                  type="text"
                  name="strength"
                  value={formData.strength}
                  onChange={handleChange}
                  placeholder="e.g., 500mg"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-tertiary text-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4">
              <div>
                <label className="block text-black font-medium mb-2">
                  Manufacturer <span className="text-red-500">*</span>
                </label>
                <select
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-tertiary text-black"
                  required
                >
                  <option value="">Select Manufacturer</option>
                  {renderOptions(manufacturerOptions, "Manufacturers")}
                </select>
              </div>

              <div>
                <label className="block text-black font-medium mb-2">
                  Allopathic or Herbal <span className="text-red-500">*</span>
                </label>
                <select
                  name="allopathicOrHerbal"
                  value={formData.allopathicOrHerbal}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-tertiary text-black"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Allopathic">Allopathic</option>
                  <option value="Herbal">Herbal</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-4">
              <div>
                <label className="block text-black font-medium mb-2">
                  Unit Price
                </label>
                <input
                  type="number"
                  name="unitPrice"
                  value={formData.unitPrice}
                  onChange={handleChange}
                  placeholder="Enter unit price"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-tertiary text-black"
                />
              </div>

              <div>
                <label className="block text-black font-medium mb-2">
                  Strip Price
                </label>
                <input
                  type="number"
                  name="stripPrice"
                  value={formData.stripPrice}
                  onChange={handleChange}
                  placeholder="Enter strip price"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-tertiary text-black"
                />
              </div>

              <div>
                <label className="block text-black font-medium mb-2">
                  Total Price
                </label>
                <input
                  type="number"
                  name="totalPrice"
                  value={formData.totalPrice}
                  onChange={handleChange}
                  placeholder="Enter total price"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-tertiary text-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-4">
              <div>
                <label className="block text-black font-medium mb-2">
                  Dosage Form
                </label>
                <input
                  type="text"
                  name="dosageForm"
                  value={formData.dosageForm}
                  onChange={handleChange}
                  placeholder="e.g., Oral Tablet"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-tertiary text-black"
                />
              </div>

              <div>
                <label className="block text-black font-medium mb-2">
                  Pack Size
                </label>
                <input
                  type="text"
                  name="packSize"
                  value={formData.packSize}
                  onChange={handleChange}
                  placeholder="e.g., 10 tablets"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-tertiary text-black"
                />
              </div>

              <div>
                <label className="block text-black font-medium mb-2">
                  Therapeutic Class
                </label>
                <input
                  type="text"
                  name="therapeuticClass"
                  value={formData.therapeuticClass}
                  onChange={handleChange}
                  placeholder="e.g., Analgesic"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-tertiary text-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4">
              <div>
                <label className="block text-black font-medium mb-2">
                  New Product
                </label>
                <select
                  name="newProduct"
                  value={formData.newProduct}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-tertiary text-black"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div>
                <label className="block text-black font-medium mb-2">
                  Bioequivalent Drug
                </label>
                <select
                  name="bioequivalentDrug"
                  value={formData.bioequivalentDrug}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-tertiary text-black"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Brand Image */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
              Brand Image
            </h2>
            <div>
              <label className="block text-black font-medium mb-2">
                Pack Image <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                name="packImage"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 text-black cursor-pointer"
                required
              />
              {preview && (
                <div className="mt-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full max-h-64 object-contain rounded-lg border border-gray-300"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section: Alternate Brands */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
              Alternate Brands
            </h2>
            <div>
              <label className="block text-black font-medium mb-2">
                Select Alternate Brands
              </label>

              {/* Search Bar */}
              <input
                type="text"
                placeholder="Search brands..."
                className="w-full border border-gray-300 rounded-lg p-3 mb-3 text-black"
                value={searchAlternateBrands}
                onChange={(e) => setSearchAlternateBrands(e.target.value)}
              />

              {/* Scrollable List */}
              <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2 bg-white">
                {filteredBrandOptions.length === 0 ? (
                  <p className="text-gray-500 text-sm">No brands found</p>
                ) : (
                  filteredBrandOptions.map((brand) => (
                    <label
                      key={brand._id}
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={formData.alternateBrands.includes(brand._id)}
                        onChange={() => toggleAlternateBrand(brand._id)}
                      />
                      <span className="text-black">{brand.name}</span>
                    </label>
                  ))
                )}
              </div>

              <p className="text-gray-600 text-sm mt-2">
                Selected: {formData.alternateBrands.length}
              </p>
            </div>
          </div>

          {/* Section: Medical / Informational Fields */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
              Medical / Informational Fields
            </h2>

            <div className="flex flex-col gap-4">
              <RenderTextarea
                name="indication"
                label="Indication"
                value={formData.indication}
                onChange={handleChange}
              />

              <RenderTextarea
                name="composition"
                label="Composition"
                value={formData.composition}
                onChange={handleChange}
              />

              <RenderTextarea
                name="pharmacology"
                label="Pharmacology"
                value={formData.pharmacology}
                onChange={handleChange}
              />

              <RenderTextarea
                name="dosageAndAdministration"
                label="Dosage & Administration"
                value={formData.dosageAndAdministration}
                onChange={handleChange}
              />

              <RenderTextarea
                name="interaction"
                label="Interaction"
                value={formData.interaction}
                onChange={handleChange}
              />

              <RenderTextarea
                name="contraindication"
                label="Contraindications"
                value={formData.contraindication}
                onChange={handleChange}
              />

              <RenderTextarea
                name="sideEffect"
                label="Side Effects"
                value={formData.sideEffect}
                onChange={handleChange}
              />

              <RenderTextarea
                name="pregnancyAndLactation"
                label="Pregnancy & Lactation"
                value={formData.pregnancyAndLactation}
                onChange={handleChange}
              />

              <RenderTextarea
                name="precautionsAndWarnings"
                label="Precautions & Warnings"
                value={formData.precautionsAndWarnings}
                onChange={handleChange}
              />

              <RenderTextarea
                name="overdoseEffect"
                label="Overdose Effects"
                value={formData.overdoseEffect}
                onChange={handleChange}
              />

              <RenderTextarea
                name="storageCondition"
                label="Storage Conditions"
                value={formData.storageCondition}
                onChange={handleChange}
              />

              <RenderTextarea
                name="commonQuestions"
                label={`Common Questions about ${formData.name || "Brand"}`}
                value={formData.commonQuestions}
                onChange={handleChange}
                rows={6}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-bg text-white py-3 px-8 rounded-lg cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Brand"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateBrand;
