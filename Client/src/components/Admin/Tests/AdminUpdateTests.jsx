import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { UpdateTest, GetTestById } from "../../../lib/APIs/testAPI";
import { TrustedCenterOptions } from "../../../lib/APIs/TrustedCenterAPI";

const AdminUpdateTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { quill, quillRef } = useQuill();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
    trustedCenters: [],
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingOptions, setFetchingOptions] = useState(false);
  const [trustedCenterOptions, setTrustedCenterOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ✅ Sync Quill content with formData
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

  // ✅ Fetch trusted centers (dropdown)
  const fetchTrustedCenters = async () => {
    try {
      setFetchingOptions(true);
      const response = await TrustedCenterOptions();
      setTrustedCenterOptions(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (err) {
      console.error("Error fetching trusted centers:", err);
      toast.error(err.response?.data?.message || "Failed to fetch centers");
    } finally {
      setFetchingOptions(false);
    }
  };

  // ✅ Fetch test details for editing
  useEffect(() => {
    const fetchMedicalTest = async () => {
      try {
        setLoading(true);
        const res = await GetTestById(id);
        const data = res.data || res; // handle both structures

        setFormData({
          name: data.name || "",
          description: data.description || "",
          image: null,
          trustedCenters: data.trustedCenters?.map((tc) => tc._id) || [],
        });

        setPreview(data.imageURL || null);

        // ✅ Wait until Quill is initialized before setting HTML
        if (quill) {
          setTimeout(() => {
            quill.root.innerHTML = data.description || "";
          }, 300);
        }
      } catch (err) {
        console.error(err);
        setErrorMessage("Failed to load medical test details.");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalTest();
    fetchTrustedCenters();
  }, [id, quill]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    } else if (name === "trustedCenters") {
      const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
      setFormData((prev) => ({ ...prev, trustedCenters: selected }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Submit form (multipart/form-data)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("trustedCenters", JSON.stringify(formData.trustedCenters));
      if (formData.image) data.append("image", formData.image);

      const response = await UpdateTest(id, data);

      setSuccessMessage(
        response.message || "Medical Test updated successfully!"
      );
      toast.success(response.message || "Medical Test updated successfully!");

      setTimeout(() => navigate("/admin/medical-test"), 600);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.message || "Failed to update medical test."
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Render dropdown options
  const renderOptions = (data, label) => {
    if (fetchingOptions) return <option>Loading {label}...</option>;
    if (!data.length) return <option>No {label} available</option>;
    return data.map((item) => (
      <option key={item._id} value={item._id}>
        {item.name}
      </option>
    ));
  };

  return (
    <div className="w-full min-h-screen flex justify-center bg-gray-100">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8 my-10 border border-gray-200">
        <h1 className="text-3xl font-semibold text-black mb-8 border-b-2 border-tertiary pb-2">
          Update Medical Test
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
              placeholder="Enter medical test name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
              required
            />
          </div>

          {/* Description (Quill) */}
          <div>
            <label className="block text-black font-medium mb-2">
              Description
            </label>
            <div className="border border-gray-300 rounded-lg">
              <div ref={quillRef} className="h-40 text-black" />
            </div>
          </div>

          {/* Trusted Centers */}
          <div>
            <label className="block text-black font-medium mb-2">
              Trusted Centers
            </label>
            <select
              name="trustedCenters"
              multiple
              value={formData.trustedCenters}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
            >
              {renderOptions(trustedCenterOptions, "Trusted Centers")}
            </select>
            <p className="text-gray-500 text-sm mt-1">
              Hold <b>Ctrl</b> (or <b>Cmd</b> on Mac) to select multiple.
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-black font-medium mb-2">
              Test Image
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

          {/* Messages */}
          {errorMessage && (
            <div className="bg-red-100 text-red-600 border border-red-600 p-3 rounded-sm text-sm">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-100 text-green-600 border border-green-600 p-3 rounded-sm text-sm">
              {successMessage}
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="bg-bg text-white py-2 px-6 rounded-lg cursor-pointer"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Medical Test"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdateTest;
