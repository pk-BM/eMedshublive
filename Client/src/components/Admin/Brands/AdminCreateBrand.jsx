import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { CreateBrand } from "../../../lib/APIs/brandsAPI";
import { GenericOptions } from "../../../lib/APIs/genericAPI";
import { PharmaceuticalOptions } from "../../../lib/APIs/pharmaceuticalAPI";
import { toast } from "react-toastify";

const AdminCreateBrand = () => {
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
  const [fetchingOptions, setFetchingOptions] = useState(false);

  const [genericOptions, setGenericOptions] = useState([]);
  const [manufacturerOptions, setManufacturerOptions] = useState([]);

  // dropdown options ka data fetch
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

  // options k liye loading and empty checks
  const renderOptions = (data, label) => {
    if (fetchingOptions) return <option>Loading {label}...</option>;
    if (!data.length) return <option>No {label} available</option>;

    return data.map((item) => (
      <option key={item._id} value={item._id}>
        {item.name}
      </option>
    ));
  };

  return (
    <div className="w-full min-h-screen flex justify-center bg-gray-100">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8 my-10 border border-gray-200">
        <h1 className="text-3xl font-semibold text-black mb-8 border-b-2 border-tertiary pb-2">
          Create Brand
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
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
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-black font-medium mb-2">
                Generic
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
          </div>
          <div className="w-full">
            <label className="block text-black font-medium mb-2">
              Manufacturer
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-black font-medium mb-2">
                New Product
              </label>
              <select
                name="newProduct"
                value={formData.newProduct}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
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
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
                required
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              required
            />
            {preview && (
              <div className="mt-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-h-64 object-cover rounded-lg border border-gray-300"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="bg-bg text-white py-2 px-6 rounded-lg cursor-pointer"
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
