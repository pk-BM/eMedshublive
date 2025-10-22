import React, { useState } from "react";
import { CreateAdvertisement } from "../../../lib/APIs/advertisementAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AdminCreateAdvertisement = () => {
  const [formData, setFormData] = useState({
    organization: "",
    position: "",
    image: null,
    title: "",
    link: "",
    publishedDate: "",
    unpublishedDate: "",
    isActive: true,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔹 Enum options for position
  const positions = [
    "Top Banner",
    "Side Banner",
    "Homepage Ad",
    "Footer Ad",
    "Popup Ad",
  ];

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      if (file) setPreview(URL.createObjectURL(file));
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
      const response = await CreateAdvertisement(formData);
      toast.success(response?.message || "Advertisement created successfully!");
      setTimeout(() => navigate("/admin/advertisement"), 600);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to create advertisement."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center bg-gray-100">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8 my-10 border border-gray-200">
        <h1 className="text-3xl font-semibold text-black mb-8 border-b-2 border-tertiary pb-2">
          Add New Advertisement
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Organization */}
          <div>
            <label className="block text-black font-medium mb-2">
              Organization *
            </label>
            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              placeholder="Enter organization name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
              required
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-black font-medium mb-2">
              Position *
            </label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
              required
            >
              <option value="">Select Position</option>
              {positions.map((pos, index) => (
                <option key={index} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-black font-medium mb-2">
              Upload Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
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

          {/* Title */}
          <div>
            <label className="block text-black font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter advertisement title"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
            />
          </div>

          {/* Link */}
          <div>
            <label className="block text-black font-medium mb-2">
              Advertisement Link
            </label>
            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="Enter advertisement link"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
            />
          </div>

          {/* Published Date */}
          <div>
            <label className="block text-black font-medium mb-2">
              Published Date
            </label>
            <input
              type="date"
              name="publishedDate"
              value={formData.publishedDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
            />
          </div>

          {/* Unpublished Date */}
          <div>
            <label className="block text-black font-medium mb-2">
              Unpublished Date
            </label>
            <input
              type="date"
              name="unpublishedDate"
              value={formData.unpublishedDate}
              onChange={handleChange}
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
              disabled={loading}
              className="bg-bg text-white py-2 px-6 rounded-lg cursor-pointer"
            >
              {loading ? "Creating..." : "Create Advertisement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateAdvertisement;
