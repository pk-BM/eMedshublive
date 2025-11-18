import React, { useState, useEffect } from "react";
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
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // Fetch Trusted Centers for dropdown
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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle checkbox selection (improved UX)
  const toggleCenter = (id) => {
    setFormData((prev) => {
      const already = prev.trustedCenters.includes(id);
      return {
        ...prev,
        trustedCenters: already
          ? prev.trustedCenters.filter((x) => x !== id)
          : [...prev.trustedCenters, id],
      };
    });
  };

  const filteredCenters = trustedCenterOptions.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // Submit
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
        <h1 className="text-3xl font-semibold text-black mb-8 border-b-2 pb-2">
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
                  className="w-full max-h-64 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-black font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows={6}
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description..."
              className="w-full border border-gray-300 rounded-lg p-3 text-black focus:outline-none resize-y"
              required
            />
          </div>

          {/* Trusted Centers - NEW UI */}
          <div>
            <label className="block text-black font-medium mb-2">
              Trusted Centers
            </label>

            <input
              type="text"
              placeholder="Search center..."
              className="w-full border border-gray-300 rounded-lg p-3 mb-3 text-black"
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2 bg-gray-50">
              {fetchingOptions ? (
                <p className="text-gray-500">Loading centers...</p>
              ) : filteredCenters.length === 0 ? (
                <p className="text-gray-500 text-sm">No centers found</p>
              ) : (
                filteredCenters.map((center) => (
                  <label
                    key={center._id}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={formData.trustedCenters.includes(center._id)}
                      onChange={() => toggleCenter(center._id)}
                    />
                    <span className="text-black">{center.name}</span>
                  </label>
                ))
              )}
            </div>

            <p className="text-gray-600 text-sm mt-2">
              Selected: {formData.trustedCenters.length}
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-6 rounded-lg cursor-pointer"
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
