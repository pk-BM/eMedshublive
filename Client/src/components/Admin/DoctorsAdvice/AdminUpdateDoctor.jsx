import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { GetDoctorAdviceById, UpdateDoctorAdvice } from "../../../lib/APIs/doctorAdviceAPI";
import { toast } from "react-toastify";

const AdminUpdateDoctor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    link: "",
    isActive: true,
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // 🔹 Fetch existing doctor advice data
  const fetchDoctorAdvice = async () => {
    try {
      setFetching(true);
      const response = await GetDoctorAdviceById(id);
      const data = response.data;

      setFormData({
        title: data.title || "",
        link: data.link || "",
        image: null,
        isActive: data.isActive ?? true
        ,
      });

      if (data.image) {
        setPreview(data.image);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to fetch doctor advice."
      );
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchDoctorAdvice();
  }, [id]);

  // 🔹 Handle form input changes
const handleChange = (e) => {
  const { name, value, type, files, checked } = e.target;

  if (type === "file") {
    const file = files[0];
    setFormData((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  } else if (type === "checkbox") {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  } else {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
};


  // 🔹 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await UpdateDoctorAdvice(id, formData);
      toast.success(response.message || "Doctor advice updated successfully!");
      setTimeout(() => navigate("/admin/doctors"), 600);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to update doctor advice."
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-lg font-medium text-gray-600">
        Loading doctor advice data...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex justify-center bg-gray-100">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8 my-10 border border-gray-200">
        <h1 className="text-3xl font-semibold text-black mb-8 border-b-2 border-tertiary pb-2">
          Update Doctor Advice
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Title */}
          <div>
            <label className="block text-black font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter title"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-black font-medium mb-2">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 text-black cursor-pointer"
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

          {/* Link */}
          <div>
            <label className="block text-black font-medium mb-2">Video Link</label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="Paste video URL here..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
            />
          </div>

                      {/* Status */}

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

          {/* Submit */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="bg-bg text-white py-2 px-6 rounded-lg cursor-pointer"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Doctor Advice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdateDoctor;
