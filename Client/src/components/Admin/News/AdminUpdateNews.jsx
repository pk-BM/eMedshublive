import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { GetNewsById, UpdateNews } from "../../../lib/APIs/newsAPI";
import { toast } from "react-toastify";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

// ----------- RICH TEXT EDITOR COMPONENT -----------
const RichTextEditor = React.memo(({ label, value, onChange }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "color",
    "background",
  ];

  const { quill, quillRef } = useQuill({ modules, formats, theme: "snow" });

  useEffect(() => {
    if (quill) {
      // Set initial content
      if (value && quill.root.innerHTML !== value) {
        quill.root.innerHTML = value;
      }

      // Handle text changes
      quill.on("text-change", () => {
        const html = quill.root.innerHTML;
        onChange(html === "<p><br></p>" ? "" : html);
      });
    }
  }, [quill, onChange, value]);

  return (
    <div className="mb-6">
      <label className="block mb-2 text-gray-700 font-medium">{label}</label>
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
        <div ref={quillRef} className="min-h-[200px]" />
      </div>
    </div>
  );
});
// ----------------------------------------------------------------

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

  // Fetch the news item
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
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch news.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "isActive" ? value === "true" : value,
      }));
    }
  };

  // Handle rich text editor changes
  const handleDescriptionChange = useCallback((value) => {
    setFormData((prev) => ({ ...prev, description: value }));
  }, []);

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await UpdateNews(id, formData);
      toast.success(response.message || "News updated successfully!");

      setTimeout(() => navigate("/admin/news"), 500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update news.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-bg rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-600">Loading news data...</p>
        </div>
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
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-bg focus:border-transparent text-black transition-all duration-200"
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
              className="w-full border border-gray-300 rounded-lg p-3 text-black cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200"
            />
            {preview && (
              <div className="mt-4 p-2 border border-gray-200 rounded-lg bg-gray-50">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-h-64 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Description - Rich Text Editor */}
          <RichTextEditor
            label="Description"
            value={formData.description}
            onChange={handleDescriptionChange}
          />

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
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-bg focus:border-transparent text-black transition-all duration-200 cursor-pointer"
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
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-bg focus:border-transparent text-black transition-all duration-200 cursor-pointer"
                required
              />
            </div>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-bg rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
            <span className="text-black font-medium">
              {formData.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Submit */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="bg-bg text-white py-3 px-8 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </span>
              ) : (
                "Update News"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdateNews;
