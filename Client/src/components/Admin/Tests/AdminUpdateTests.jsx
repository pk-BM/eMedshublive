import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { UpdateTest, GetTestById } from "../../../lib/APIs/testAPI";
import { TrustedCenterOptions } from "../../../lib/APIs/TrustedCenterAPI";
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
      if (value && quill.root.innerHTML !== value) {
        quill.root.innerHTML = value;
      }

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
  const [fetching, setFetching] = useState(true);
  const [fetchingOptions, setFetchingOptions] = useState(false);
  const [trustedCenterOptions, setTrustedCenterOptions] = useState([]);
  const [search, setSearch] = useState("");

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
        setFetching(true);
        const res = await GetTestById(id);
        const data = res.data || res;

        setFormData({
          name: data.name || "",
          description: data.description || "",
          image: null,
          trustedCenters: data.trustedCenters?.map((tc) => tc) || [],
        });

        setPreview(data.image || null);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load medical test details.");
      } finally {
        setFetching(false);
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

  // Handle rich text editor changes
  const handleDescriptionChange = useCallback((value) => {
    setFormData((prev) => ({ ...prev, description: value }));
  }, []);

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

      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("trustedCenters", JSON.stringify(formData.trustedCenters));
      if (formData.image) data.append("image", formData.image);

      const response = await UpdateTest(id, data);
      toast.success(response.message || "Medical Test updated successfully!");
      setTimeout(() => navigate("/admin/medical-test"), 600);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update medical test.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-bg rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-600">Loading medical test data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex justify-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-8 my-10 border border-gray-200">
        <h1 className="text-3xl font-semibold text-black mb-8 border-b-2 border-tertiary pb-2">
          Update Medical Test
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Section: Basic Info */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Basic Information</h2>

            {/* Name */}
            <div>
              <label className="block text-black font-medium mb-2">Test Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter medical test name"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-bg focus:border-transparent text-black transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Section: Description */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Description</h2>
            <RichTextEditor
              label=""
              value={formData.description}
              onChange={handleDescriptionChange}
            />
          </div>

          {/* Section: Trusted Centers */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Trusted Centers</h2>

            <input
              type="text"
              placeholder="Search center..."
              className="w-full border border-gray-300 rounded-lg p-3 mb-3 text-black focus:outline-none focus:ring-2 focus:ring-bg focus:border-transparent transition-all duration-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2 bg-white">
              {fetchingOptions ? (
                <div className="flex items-center justify-center py-4">
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-bg rounded-full animate-spin"></div>
                  <span className="ml-2 text-gray-500">Loading centers...</span>
                </div>
              ) : filteredCenters.length === 0 ? (
                <p className="text-gray-500 text-sm py-2 text-center">No centers found</p>
              ) : (
                filteredCenters.map((center) => (
                  <label
                    key={center._id}
                    className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-all duration-200 ${
                      formData.trustedCenters.includes(center._id)
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-bg"
                      checked={formData.trustedCenters.includes(center._id)}
                      onChange={() => toggleCenter(center._id)}
                    />
                    <span className="text-black">{center.name}</span>
                  </label>
                ))
              )}
            </div>

            <p className="text-gray-600 text-sm mt-2">
              Selected: <span className="font-medium text-black">{formData.trustedCenters.length}</span>
            </p>
          </div>

          {/* Section: Image */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Test Image</h2>

            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 text-black cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200 bg-white"
            />

            {preview && (
              <div className="mt-4 p-2 border border-gray-200 rounded-lg bg-white">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-h-64 object-contain rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end mt-4">
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
                "Update Medical Test"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdateTest;
