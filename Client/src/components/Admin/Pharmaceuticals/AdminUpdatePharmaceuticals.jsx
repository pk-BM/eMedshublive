 import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GetPharmaceuticalById, updatePharmaceutical  } from "../../../lib/APIs/pharmaceuticalAPI";
import { toast } from "react-toastify";

const AdminUpdatePharmaceuticals = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    logo: null,
    totalGenerics: "",
    contactDetails: "",
    address: "",
    mapLink: "",
    isActive: true,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // 🔹 Fetch existing pharmaceutical data
  const fetchPharmaceutical = async () => {
    try {
      setFetching(true);
      const response = await GetPharmaceuticalById(id);
      const data = response.data;

      setFormData({
        name: data.name || "",
        totalGenerics: data.totalGenerics || "",
        contactDetails: data.contactDetails || "",
        address: data.address || "",
        mapLink: data.mapLink || "",
        logo: null,
        isActive: data.isActive ?? true,
      });

      if (data.logo) {
        setPreview(data.logo);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch pharmaceutical details."
      );
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchPharmaceutical();
  }, [id]);

  // 🔹 Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, logo: file }));
      setPreview(URL.createObjectURL(file));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 🔹 Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await updatePharmaceutical(id, formData);
      toast.success(response.message || "Pharmaceutical updated successfully!");
      setTimeout(() => navigate("/admin/pharmaceuticals"), 600);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to update pharmaceutical."
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-lg font-medium text-gray-600">
        Loading pharmaceutical data...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex justify-center bg-gray-100">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8 my-10 border border-gray-200">
        <h1 className="text-3xl font-semibold text-black mb-8 border-b-2 border-tertiary pb-2">
          Update Pharmaceutical
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Name */}
          <div>
            <label className="block text-black font-medium mb-2">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter pharmaceutical name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
              required
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-black font-medium mb-2">
              Upload Logo
            </label>
            <input
              type="file"
              accept="image/*"
              name="logo"
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

          {/* Total Generics */}
          <div>
            <label className="block text-black font-medium mb-2">
              Total Generics
            </label>
            <input
              type="number"
              name="totalGenerics"
              value={formData.totalGenerics}
              onChange={handleChange}
              placeholder="Enter number of generics"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
            />
          </div>

          {/* Contact Details */}
          <div>
            <label className="block text-black font-medium mb-2">
              Contact Details
            </label>
            <input
              type="text"
              name="contactDetails"
              value={formData.contactDetails}
              onChange={handleChange}
              placeholder="Enter contact information"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-black font-medium mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
            />
          </div>

          {/* Map Link */}
          <div>
            <label className="block text-black font-medium mb-2">Map Link</label>
            <input
              type="text"
              name="mapLink"
              value={formData.mapLink}
              onChange={handleChange}
              placeholder="Enter Google Maps link"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
            />
          </div>

          {/* Active Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600"
            />
            <label className="ml-2 text-gray-700 font-medium">Active</label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="bg-bg text-white py-2 px-6 rounded-lg cursor-pointer"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Pharmaceutical"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdatePharmaceuticals;
