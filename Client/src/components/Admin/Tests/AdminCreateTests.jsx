import React, { useState, useEffect } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { CreateTest } from "../../../lib/APIs/testAPI";
import { TrustedCenterOptions } from "../../../lib/APIs/TrustedCenterAPI";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const AdminCreateTests = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
    trustedCenters: [],
  });

  const [preview, setPreview] = useState(null);
  const [trustedCenterOptions, setTrustedCenterOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingOptions, setFetchingOptions] = useState(false);

  const navigate = useNavigate();

  // ✅ Quill setup
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
    placeholder: "Write your test description here...",
    theme: "snow",
  });

  // ✅ Sync Quill content to formData
  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        setFormData((prev) => ({
          ...prev,
          description: quill.root.innerHTML,
        }));
      });
    }
  }, [quill]);

  // ✅ Fetch Trusted Centers for dropdown
  useEffect(() => {
    const fetchTrustedCenters = async () => {
      try {
        setFetchingOptions(true);
        const res = await TrustedCenterOptions();
        setTrustedCenterOptions(Array.isArray(res?.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching trusted centers:", err);
        toast.error(err.response?.data?.message || "Failed to fetch centers");
      } finally {
        setFetchingOptions(false);
      }
    };

    fetchTrustedCenters();
  }, []);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Handle multi-select trusted centers
  const handleSelectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setFormData((prev) => ({ ...prev, trustedCenters: selectedOptions }));
  };

  // ✅ Render dropdown options safely
  const renderTrustedCenterOptions = () => {
    if (fetchingOptions) return <option>Loading centers...</option>;
    if (!trustedCenterOptions.length)
      return <option>No centers available</option>;

    return trustedCenterOptions.map((center) => (
      <option key={center._id} value={center._id}>
        {center.name}
      </option>
    ));
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await CreateTest(formData);
      toast.success(response.message || "Medical Test Created Successfully");
      setTimeout(() => navigate("/admin/medical-test"), 500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center bg-gray-100">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8 my-10 border border-gray-200">
        <h1 className="text-3xl font-semibold text-black mb-8 border-b-2 border-tertiary pb-2">
          Create Medical Test
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Test Name */}
          <div>
            <label className="block text-black font-medium mb-2">
              Test Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter test name"
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

          {/* Trusted Centers Dropdown */}
          <div>
            <label className="block text-black font-medium mb-2">
              Trusted Centers
            </label>
            <select
              multiple
              name="trustedCenters"
              onChange={handleSelectChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
            >
              {renderTrustedCenterOptions()}
            </select>
            <p className="text-gray-500 text-sm mt-1">
              Hold Ctrl (Windows) or Cmd (Mac) to select multiple.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="bg-bg text-white py-2 px-6 rounded-lg cursor-pointer"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Test"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateTests;
