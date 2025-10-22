import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { getCenterById, UpdateCenter } from "../../../lib/APIs/TrustedCenterAPI";

const AdminUpdateTrustedCenter = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    logo: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // 🔹 Fetch existing trusted center data
  const fetchTrustedCenter = async () => {
    try {
      setFetching(true);
      const response = await getCenterById(id);
      const data = response.data;

      setFormData({
        name: data.name || "",
        logo: null,
      });

      if (data.logo) {
        setPreview(data.logo);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch trusted center.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTrustedCenter();
  }, [id]);

  // 🔹 Handle input changes
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

  // 🔹 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await UpdateCenter(id, formData);
      toast.success(response.message || "Trusted Center updated successfully!");
      setTimeout(() => navigate("/admin/trusted-center"), 500);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update trusted center.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-lg font-medium text-gray-600">
        Loading trusted center data...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex justify-center bg-gray-100">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8 my-10 border border-gray-200">
        <h1 className="text-3xl font-semibold text-black mb-8 border-b-2 border-tertiary pb-2">
          Update Trusted Center
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
              placeholder="Enter center name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
              required
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-black font-medium mb-2">Upload Logo</label>
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
                  className="w-full max-h-64 object-contain rounded-lg border border-gray-300 bg-gray-50 p-2"
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="bg-bg text-white py-2 px-6 rounded-lg cursor-pointer"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Trusted Center"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdateTrustedCenter;
