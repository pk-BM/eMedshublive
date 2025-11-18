import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { UpdateTest, GetTestById } from "../../../lib/APIs/testAPI";
import { TrustedCenterOptions } from "../../../lib/APIs/TrustedCenterAPI";

const AdminUpdateTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch Trusted Centers
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

  // Fetch Test details
  useEffect(() => {
    const fetchTest = async () => {
      try {
        setLoading(true);
        const res = await GetTestById(id);
        const data = res.data || res;

        setFormData({
          name: data.name || "",
          description: data.description || "",
          image: null,
          trustedCenters: data.trustedCenters?.map((tc) => tc) || [],
        });

        setPreview(data.imageURL || null);
      } catch (err) {
        console.error(err);
        setErrorMessage("Failed to load medical test details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
    fetchTrustedCenters();
  }, [id]);

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

  // Toggle center selection
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

          {/* Description */}
          <div>
            <label className="block text-black font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              placeholder="Enter description..."
              className="w-full border border-gray-300 rounded-lg p-3 text-black focus:outline-none resize-y"
              required
            />
          </div>

          {/* Trusted Centers */}
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

          {/* Image */}
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
