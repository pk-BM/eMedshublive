import React, { useState } from "react";
import { CreateBanner } from "../../../lib/APIs/bannerAPI"; // Make sure this API exists
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AdminCreateBanner = () => {
  const [bannerImg, setBannerImg] = useState(null);
  const [bannerPosition, setBannerPosition] = useState("");

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔹 Handle file change
  const handleChange = (e) => {
    const file = e.target.files[0];
    setBannerImg(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  // 🔹 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bannerImg) {
      toast.error("Please select a banner image.");
      return;
    }

    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("bannerImg", bannerImg);
      fd.append("position", bannerPosition);
      const response = await CreateBanner(fd);
      toast.success(response?.message || "Banner created successfully!");
      setTimeout(() => navigate("/admin/banners"), 600);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create banner.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center bg-gray-100">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8 my-10 border border-gray-200">
        <h1 className="text-3xl font-semibold text-black mb-8 border-b-2 border-tertiary pb-2">
          Add New Banner
        </h1>

        <div className="my-10 bg-gray-200 p-4 rounded-md">
          <h1 className="font-bold">Note</h1>
          <p className="text-sm font-semibold">
            For Vertical:{" "}
            <span className="font-normal">width 180px height 360px</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Banner Image Upload */}

          <div>
            <label className="block text-black font-medium mb-2">
              Position
            </label>
            <select
              name=""
              id=""
              className="w-full border border-gray-300 rounded-lg p-3 text-black cursor-pointer outline-none"
              required
              onChange={(e) => setBannerPosition(e.target.value)}
            >
              <option value="">Select</option>
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </select>
          </div>
          <div>
            <label className="block text-black font-medium mb-2">
              Upload Banner Image
            </label>
            <input
              type="file"
              name="bannerImg"
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

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={loading}
              className="bg-bg text-white py-2 px-6 rounded-lg cursor-pointer"
            >
              {loading ? "Creating..." : "Create Banner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateBanner;
