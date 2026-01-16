import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import { UpdateBrand, getBrandById, GetBrandOptions } from "../../../lib/APIs/brandsAPI";
import { GenericOptions } from "../../../lib/APIs/genericAPI";
import { PharmaceuticalOptions } from "../../../lib/APIs/pharmaceuticalAPI";
import { toast } from "react-toastify";

const AdminUpdateBrand = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productType: "",
    name: "",
    generic: "",
    manufacturer: "",
    dosageForm: "",
    strength: "",
    packSize: "",
    unitPrice: "",
    stripPrice: "",
    totalPrice: "",
    packImage: null,
    allopathicOrHerbal: "",
    newProduct: "",
    bioequivalentDrug: "",
    // New medical/informational fields
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
    // Alternate brands
    alternateBrands: [],
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [fetchingOptions, setFetchingOptions] = useState(false);

  const [genericOptions, setGenericOptions] = useState([]);
  const [manufacturerOptions, setManufacturerOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [brandSearch, setBrandSearch] = useState("");

  // Fetch dropdown data
  const fetchDropdownData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchDropdownData();
  }, [fetchDropdownData]);

  // Fetch existing brand data
  const fetchBrand = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getBrandById(id);
      const brand = response.data || response;

      setFormData({
        productType: brand.productType || "",
        name: brand.name || "",
        generic: brand?.generic?._id || "",
        manufacturer: brand?.manufacturer?._id || "",
        dosageForm: brand.dosageForm || "",
        strength: brand.strength || "",
        packSize: brand.packSize || "",
        unitPrice: brand.unitPrice || "",
        stripPrice: brand.stripPrice || "",
        totalPrice: brand.totalPrice || "",
        packImage: null,
        allopathicOrHerbal: brand.allopathicOrHerbal || "",
        newProduct: brand.newProduct || "",
        bioequivalentDrug: brand.bioequivalentDrug || "",
        // Medical/informational fields
        indication: brand.indication || "",
        composition: brand.composition || "",
        pharmacology: brand.pharmacology || "",
        dosageAndAdministration: brand.dosageAndAdministration || "",
        interaction: brand.interaction || "",
        contraindication: brand.contraindication || "",
        sideEffect: brand.sideEffect || "",
        pregnancyAndLactation: brand.pregnancyAndLactation || "",
        precautionsAndWarnings: brand.precautionsAndWarnings || "",
        overdoseEffect: brand.overdoseEffect || "",
        therapeuticClass: brand.therapeuticClass || "",
        storageCondition: brand.storageCondition || "",
        commonQuestions: brand.commonQuestions || "",
        // Alternate brands - extract IDs from populated data
        alternateBrands: brand.alternateBrands?.map((b) => b._id || b) || [],
      });

      setPreview(brand.packImage);
    } catch (err) {
      console.error("Error fetching brand:", err);
      toast.error(err.response?.data?.message || "Failed to fetch brand data.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBrand();
  }, [fetchBrand]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, packImage: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle alternate brand checkbox toggle
  const handleAlternateBrandToggle = (brandId) => {
    setFormData((prev) => {
      const isSelected = prev.alternateBrands.includes(brandId);
      if (isSelected) {
        return {
          ...prev,
          alternateBrands: prev.alternateBrands.filter((id) => id !== brandId),
        };
      } else {
        return {
          ...prev,
          alternateBrands: [...prev.alternateBrands, brandId],
        };
      }
    });
  };

  // Filter brand options based on search (exclude current brand being edited)
  const filteredBrandOptions = brandOptions.filter(
    (brand) =>
      brand._id !== id &&
      brand.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await UpdateBrand(id, formData);
      setSuccessMessage(response.message || "Brand updated successfully!");
      toast.success(response.message || "Brand updated successfully!");
      setTimeout(() => navigate("/admin/brands"), 600);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update brand.");
      setErrorMessage(
        error.response?.data?.message || "Failed to update brand."
      );
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

  // Reusable textarea component
  const RenderTextarea = ({ label, name, placeholder, rows = 4 }) => (
    <div>
      <label className="block text-black font-medium mb-2">{label}</label>
      <textarea
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black resize-vertical"
      />
    </div>
  );

  return (
    <div className="w-full min-h-screen flex justify-center bg-gray-100 px-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-4 sm:p-6 md:p-8 my-6 md:my-10 border border-gray-200">
        <h1 className="text-2xl md:text-3xl font-semibold text-black mb-6 md:mb-8 border-b-2 border-tertiary pb-2">
          Update Brand
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* ===== SECTION: Basic Information ===== */}
          <div className="border border-gray-200 rounded-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-black font-medium mb-2">
                  Product Type *
                </label>
                <input
                  type="text"
                  name="productType"
                  value={formData.productType}
                  onChange={handleChange}
                  placeholder="Enter product type"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-black font-medium mb-2">
                  Brand Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter brand name"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-black font-medium mb-2">
                  Generic *
                </label>
                <select
                  name="generic"
                  value={formData.generic}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
                  required
                >
                  <option value="">Select Generic</option>
                  {renderOptions(genericOptions, "Generics")}
                </select>
              </div>

              <div>
                <label className="block text-black font-medium mb-2">
                  Allopathic or Herbal *
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
            </div>

            <div className="mt-4 md:mt-6">
              <label className="block text-black font-medium mb-2">
                Manufacturer *
              </label>
              <select
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
                required
              >
                <option value="">Select Manufacturer</option>
                {renderOptions(manufacturerOptions, "Manufacturers")}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
              <div>
                <label className="block text-black font-medium mb-2">
                  New Product
                </label>
                <select
                  name="newProduct"
                  value={formData.newProduct}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
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
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>

            {/* Optional Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-4 md:mt-6">
              <div>
                <label className="block text-black font-medium mb-2">
                  Dosage Form
                </label>
                <input
                  type="text"
                  name="dosageForm"
                  value={formData.dosageForm}
                  onChange={handleChange}
                  placeholder="e.g. Tablet"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
                />
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
                  placeholder="e.g. 500mg"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
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
                  placeholder="e.g. 10 tablets"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
                />
              </div>
            </div>

            {/* Prices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-4 md:mt-6">
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
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
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
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
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
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
                />
              </div>
            </div>

            {/* Therapeutic Class */}
            <div className="mt-4 md:mt-6">
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
          </div>

          {/* ===== SECTION: Brand Image ===== */}
          <div className="border border-gray-200 rounded-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
              Brand Image
            </h2>

            <div>
              <label className="block text-black font-medium mb-2">
                Pack Image
              </label>
              <input
                type="file"
                accept="image/*"
                name="packImage"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 text-black cursor-pointer"
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

          {/* ===== SECTION: Alternate Brands ===== */}
          <div className="border border-gray-200 rounded-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
              Alternate Brands
            </h2>

            <div>
              <label className="block text-black font-medium mb-2">
                Search & Select Alternate Brands
              </label>
              <input
                type="text"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                placeholder="Search brands..."
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black mb-3"
              />

              {formData.alternateBrands.length > 0 && (
                <div className="mb-3 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700 font-medium">
                    Selected: {formData.alternateBrands.length} brand(s)
                  </p>
                </div>
              )}

              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {fetchingOptions ? (
                  <p className="text-gray-500">Loading brands...</p>
                ) : filteredBrandOptions.length === 0 ? (
                  <p className="text-gray-500">No brands found</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredBrandOptions.map((brand) => (
                      <label
                        key={brand._id}
                        className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100 ${
                          formData.alternateBrands.includes(brand._id)
                            ? "bg-green-100"
                            : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.alternateBrands.includes(brand._id)}
                          onChange={() => handleAlternateBrandToggle(brand._id)}
                          className="w-4 h-4 text-green-600"
                        />
                        <span className="text-sm text-gray-700">
                          {brand.name}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ===== SECTION: Medical/Informational Fields ===== */}
          <div className="border border-gray-200 rounded-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
              Medical Information
            </h2>

            <div className="grid grid-cols-1 gap-4 md:gap-6">
              <RenderTextarea
                label="Composition"
                name="composition"
                placeholder="Enter composition details"
              />

              <RenderTextarea
                label="Indication"
                name="indication"
                placeholder="Enter indication details"
              />

              <RenderTextarea
                label="Pharmacology"
                name="pharmacology"
                placeholder="Enter pharmacology details"
              />

              <RenderTextarea
                label="Dosage & Administration"
                name="dosageAndAdministration"
                placeholder="Enter dosage and administration details"
              />

              <RenderTextarea
                label="Interaction"
                name="interaction"
                placeholder="Enter drug interaction details"
              />

              <RenderTextarea
                label="Contraindication"
                name="contraindication"
                placeholder="Enter contraindication details"
              />

              <RenderTextarea
                label="Side Effects"
                name="sideEffect"
                placeholder="Enter side effects"
              />

              <RenderTextarea
                label="Pregnancy & Lactation"
                name="pregnancyAndLactation"
                placeholder="Enter pregnancy and lactation information"
              />

              <RenderTextarea
                label="Precautions & Warnings"
                name="precautionsAndWarnings"
                placeholder="Enter precautions and warnings"
              />

              <RenderTextarea
                label="Overdose Effect"
                name="overdoseEffect"
                placeholder="Enter overdose effect details"
              />

              <RenderTextarea
                label="Storage Condition"
                name="storageCondition"
                placeholder="Enter storage condition details"
                rows={2}
              />

              <RenderTextarea
                label="Common Questions"
                name="commonQuestions"
                placeholder="Enter common questions and answers"
                rows={5}
              />
            </div>
          </div>

          {/* Messages */}
          {errorMessage && (
            <div className="bg-red-100 text-red-600 border border-red-600 p-3 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-100 text-green-600 border border-green-600 p-3 rounded-lg text-sm">
              {successMessage}
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end mt-4 md:mt-8">
            <button
              type="submit"
              className="bg-bg text-white py-3 px-8 rounded-lg cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Brand"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdateBrand;
