import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GetBannerById, UpdateBanner } from "../../../lib/APIs/bannerAPI"; // Make sure these APIs exist
import { toast } from "react-toastify";

const AdminUpdateBanner = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [bannerImg, setBannerImg] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

 
  const fetchBanner = async () => {
    try {
      setLoading(true);
      const res = await GetBannerById(id);
      if (res?.data?.bannerImgUrl) {
        setPreview(res.data.bannerImgUrl);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch banner");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, [id]);

  const handleChange = (e) => {
    const file = e.target.files[0];
    setBannerImg(file);
    if (file) setPreview(URL.createObjectURL(file));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bannerImg && !preview) {
      toast.error("Please select a banner image.");
      return;
    }

    try {
      setLoading(true);
      const fd = new FormData();
      if (bannerImg) fd.append("bannerImg", bannerImg);

      const response = await UpdateBanner(id, fd);
      toast.success(response?.message || "Banner updated successfully!");
      setTimeout(() => navigate("/admin/banners"), 600);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update banner.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center bg-gray-100">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8 my-10 border border-gray-200">
        <h1 className="text-3xl font-semibold text-black mb-8 border-b-2 border-tertiary pb-2">
          Update Banner
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Banner Image Upload */}
          <div>
            <label className="block text-black font-medium mb-2">
              Upload Banner Image *
            </label>
            <input
              type="file"
              name="bannerImg"
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

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={loading}
              className="bg-bg text-white py-2 px-6 rounded-lg cursor-pointer"
            >
              {loading ? "Updating..." : "Update Banner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdateBanner;
