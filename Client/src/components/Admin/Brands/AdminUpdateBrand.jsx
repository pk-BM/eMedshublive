import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { UpdateBrand } from "../../../lib/APIs/brandsAPI";
import { getBrandById } from "../../../lib/APIs/brandsAPI";
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
    totalPrice: "",
    packImage: null,
    allopathicOrHerbal: "",
    newProduct: "",
    bioequivalentDrug: "",
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [fetchingOptions, setFetchingOptions] = useState(false);

  const [genericOptions, setGenericOptions] = useState([]);
  const [manufacturerOptions, setManufacturerOptions] = useState([]);

  // Fetch dropdown options
  const fetchDropdownData = async () => {
    try {
      setFetchingOptions(true);

      const [genericRes, manufacturerRes] = await Promise.all([
        GenericOptions(),
        PharmaceuticalOptions(),
      ]);

      setGenericOptions(Array.isArray(genericRes.data) ? genericRes.data : []);
      setManufacturerOptions(
        Array.isArray(manufacturerRes.data) ? manufacturerRes.data : []
      );
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

  // Fetch existing brand data
  const fetchBrand = async () => {
    try {
      setFetching(true);
      const response = await getBrandById(id);
      const brand = response.data || response;

      setFormData({
        productType: brand.productType || "",
        name: brand.name || "",
        generic: brand?.generic?._id,
        manufacturer: brand?.manufacturer?._id,
        dosageForm: brand.dosageForm || "",
        strength: brand.strength || "",
        packSize: brand.packSize || "",
        unitPrice: brand.unitPrice || "",
        totalPrice: brand.totalPrice || "",
        packImage: null,
        allopathicOrHerbal: brand.allopathicOrHerbal || "",
        newProduct: brand.newProduct || "",
        bioequivalentDrug: brand.bioequivalentDrug || "",
      });

      setPreview(brand.packImage);
    } catch (err) {
      console.error("Error fetching brand:", err);
      toast.error(err.response?.data?.message || "Failed to fetch brand data.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchBrand();
  }, [id]);

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

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await UpdateBrand(id, formData);
      toast.success(response.message || "Brand updated successfully!");
      setTimeout(() => navigate("/admin/brands"), 600);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update brand.");
    } finally {
      setLoading(false);
    }
  };

  // Render options for select dropdowns
  const renderOptions = (data, label) => {
    if (fetchingOptions) return <option>Loading {label}...</option>;
    if (!data.length) return <option>No {label} available</option>;

    return data.map((item) => (
      <option key={item._id} value={item._id}>
        {item.name}
      </option>
    ));
  };

  if (fetching) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-bg rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-600">Loading brand data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex justify-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-8 my-10 border border-gray-200">
        <h1 className="text-3xl font-semibold text-black mb-8 border-b-2 border-tertiary pb-2">
          Update Brand
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Section: Basic Info */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-black font-medium mb-2">
                  Product Type
                </label>
                <input
                  type="text"
                  name="productType"
                  value={formData.productType}
                  onChange={handleChange}
                  placeholder="Enter product type"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-bg focus:border-transparent text-black transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-black font-medium mb-2">
                  Brand Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter brand name"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-bg focus:border-transparent text-black transition-all duration-200"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section: Classification */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Classification</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-black font-medium mb-2">
                  Generic
                </label>
                <select
                  name="generic"
                  value={formData.generic}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-bg focus:border-transparent text-black transition-all duration-200 cursor-pointer"
                  required
                >
                  <option value="">Select Generic</option>
                  {renderOptions(genericOptions, "Generics")}
                </select>
              </div>

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
            </div>

            <div className="mt-6">
              <label className="block text-black font-medium mb-2">
                Manufacturer
              </label>
              <select
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-bg focus:border-transparent text-black transition-all duration-200 cursor-pointer"
                required
              >
                <option value="">Select Manufacturer</option>
                {renderOptions(manufacturerOptions, "Manufacturers")}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-black font-medium mb-2">
                  New Product
                </label>
                <select
                  name="newProduct"
                  value={formData.newProduct}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-bg focus:border-transparent text-black transition-all duration-200 cursor-pointer"
                  required
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
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-bg focus:border-transparent text-black transition-all duration-200 cursor-pointer"
                  required
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Product Details */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Product Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-bg focus:border-transparent text-black transition-all duration-200"
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
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-bg focus:border-transparent text-black transition-all duration-200"
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
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-bg focus:border-transparent text-black transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Section: Pricing */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-black font-medium mb-2">
                  Unit Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rs.</span>
                  <input
                    type="number"
                    name="unitPrice"
                    value={formData.unitPrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-bg focus:border-transparent text-black transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-black font-medium mb-2">
                  Total Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rs.</span>
                  <input
                    type="number"
                    name="totalPrice"
                    value={formData.totalPrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-bg focus:border-transparent text-black transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Image Upload */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Pack Image</h2>
            <input
              type="file"
              accept="image/*"
              name="packImage"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 text-black cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200 bg-white"
            />
            {preview && (
              <div className="mt-4 p-2 border border-gray-200 rounded-lg bg-white">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-h-64 object-contain rounded-lg"
                />
              </div>
            )}
          </div>

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
                  Updating...
                </span>
              ) : (
                "Update Brand"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdateBrand;
