import React, { useState } from "react";
import { CreateLeader } from "../../../lib/APIs/leaderAPI"; // 🔹 Make sure you have this API function
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AdminCreateLeader = () => {
  const [formData, setFormData] = useState({
    profilePicture: null,
    name: "",
    designation: "",
    previous: "",
    institution: "",
    department: "",
    bio: "",
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔹 Handle input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      if (file) setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 🔹 Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await CreateLeader(formData);
      toast.success(response?.message || "Leader created successfully!");
      setTimeout(() => navigate("/admin/leaders"), 600);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to create leader."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center bg-gray-100">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8 my-10 border border-gray-200">
        <h1 className="text-3xl font-semibold text-black mb-8 border-b-2 border-tertiary pb-2">
          Add Leader
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Profile Picture */}
          <div>
            <label className="block text-black font-medium mb-2">
              Upload Profile Picture *
            </label>
            <input
              type="file"
              name="profilePicture"
              accept="image/*"
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

          {/* Name */}
          <div>
            <label className="block text-black font-medium mb-2">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter leader's name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
              required
            />
          </div>

          {/* Designation */}
          <div>
            <label className="block text-black font-medium mb-2">
              Designation *
            </label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Enter designation"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
              required
            />
          </div>

          {/* Previous */}
          <div>
            <label className="block text-black font-medium mb-2">
              Previous *
            </label>
            <input
              type="text"
              name="previous"
              value={formData.previous}
              onChange={handleChange}
              placeholder="Enter previous position or organization"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
              required
            />
          </div>

          {/* Institution */}
          <div>
            <label className="block text-black font-medium mb-2">
              Institution *
            </label>
            <input
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              placeholder="Enter institution name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
              required
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-black font-medium mb-2">
              Department *
            </label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Enter department name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-black font-medium mb-2">Bio *</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Write a short biography"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black h-32 resize-none"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={loading}
              className="bg-bg text-white py-2 px-6 rounded-lg cursor-pointer"
            >
              {loading ? "Creating..." : "Create Leader"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateLeader;
