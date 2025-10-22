import React, { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { CreateTrustedCenter } from "../../../lib/APIs/TrustedCenterAPI";

const AdminCreateTrustedCenter = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    logo: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, logo: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await CreateTrustedCenter(formData);
      toast.success(response.message || "Trusted Center created successfully!");

      setTimeout(() => navigate("/admin/trusted-center"), 600);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center bg-gray-100">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8 my-10 border border-gray-200">
        <h1 className="text-3xl font-semibold text-black mb-8 border-b-2 border-tertiary pb-2">
          Create Trusted Center
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Center Name */}
          <div>
            <label className="block text-black font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter trusted center name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
              required
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-black font-medium mb-2">
              Center Logo
            </label>
            <input
              type="file"
              accept="image/*"
              name="logo"
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

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="bg-bg text-white py-2 px-6 rounded-lg cursor-pointer"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Trusted Center"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateTrustedCenter;
