import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { GetNewsById, UpdateNews } from "../../../lib/APIs/newsAPI";
import { toast } from "react-toastify";

const AdminUpdateNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    publishDate: "",
    unpublishDate: "",
    isActive: true,
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
    },
    placeholder: "Edit your news content here...",
    theme: "snow",
  });

  // 🔹 Fetch existing news data
  const fetchNews = async () => {
    try {
      setFetching(true);
      const response = await GetNewsById(id);
      const data = response.data;

      setFormData({
        title: data.title || "",
        description: data.description || "",
        publishDate: data.publishDate ? data.publishDate.split("T")[0] : "",
        unpublishDate: data.unpublishDate
          ? data.unpublishDate.split("T")[0]
          : "",
        image: null,
        isActive: data.isActive ?? true,
      });

      if (data.image) {
        setPreview(data.image);
      }

      if (quill) {
        quill.root.innerHTML = data.description || "";
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch news.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [id]);

  useEffect(() => {
    if (quill && formData.description) {
      quill.root.innerHTML = formData.description;
      quill.on("text-change", () => {
        setFormData((prev) => ({
          ...prev,
          description: quill.root.innerHTML,
        }));
      });
    }
  }, [quill]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "isActive" ? value === "true" : value, // Convert string to boolean
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await UpdateNews(id, formData);
      toast.success(response.message || "News updated successfully!");
      setTimeout(() => navigate("/admin/news"), 500);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update news.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-lg font-medium text-gray-600">
        Loading news data...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex justify-center bg-gray-100">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8 my-10 border border-gray-200">
        <h1 className="text-3xl font-semibold text-black mb-8 border-b-2 border-tertiary pb-2">
          Update News
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
              placeholder="Enter news title"
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

          {/* Description */}
          <div>
            <label className="block text-black font-medium mb-2">
              Description
            </label>
            <div
              ref={quillRef}
              className="bg-white border border-gray-300 rounded-lg"
              style={{ minHeight: "200px" }}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-black font-medium mb-2">
                Publish Date
              </label>
              <input
                type="date"
                name="publishDate"
                value={formData.publishDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
                required
              />
            </div>

            <div>
              <label className="block text-black font-medium mb-2">
                Unpublish Date
              </label>
              <input
                type="date"
                name="unpublishDate"
                value={formData.unpublishDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
                required
              />
            </div>
          </div>
          {/* isActive Dropdown */}
          <div>
            <label className="block text-black font-medium mb-2">Status</label>
            <select
              name="isActive"
              value={formData.isActive}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black bg-white"
              required
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {/* Submit */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="bg-bg text-white py-2 px-6 rounded-lg cursor-pointer"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update News"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdateNews;
