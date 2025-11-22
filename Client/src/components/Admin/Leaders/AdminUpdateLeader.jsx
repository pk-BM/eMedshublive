import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { GetLeaderById, UpdateLeader } from "../../../lib/APIs/leaderAPI";
import { toast } from "react-toastify";

const AdminUpdateLeader = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    profilePicture: null,
    name: "",
    designation: "",
    pharmaLeader: "",
    institution: "",
    department: "",
    bio: "",
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // 🔹 Fetch existing leader data
  const fetchLeader = async () => {
    try {
      setFetching(true);
      const response = await GetLeaderById(id);
      const data = response.data;

      setFormData({
        profilePicture: null,
        name: data.name || "",
        designation: data.designation || "",
        pharmaLeader: data.pharmaLeader || "",
        institution: data.institution || "",
        department: data.department || "",
        bio: data.bio || "",
      });

      if (data.profilePicture) setPreview(data.profilePicture);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch leader.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchLeader();
  }, [id]);

  // 🔹 Handle input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      if (file) setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 🔹 Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await UpdateLeader(id, formData);
      toast.success(response?.message || "Leader updated successfully!");
      setTimeout(() => navigate("/admin/leaders"), 500);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update leader.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-lg font-medium text-gray-600">
        Loading leader data...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex justify-center bg-gray-100">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8 my-10 border border-gray-200">
        <h1 className="text-3xl font-semibold text-black mb-8 border-b-2 border-tertiary pb-2">
          Update Leader
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Profile Picture */}
          <div>
            <label className="block text-black font-medium mb-2">
              Upload Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              name="profilePicture"
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

          {/* Name */}
          <div>
            <label className="block text-black font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter leader's name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
              required
            />
          </div>

          {/* Designation */}
          <div>
            <label className="block text-black font-medium mb-2">
              Designation
            </label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Enter designation"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
              required
            />
          </div>

          {/* Previous */}
          <div>
            <label className="block text-black font-medium mb-2">
              Pharma Leader *
            </label>
            <input
              type="text"
              name="pharmaLeader"
              value={formData.pharmaLeader}
              onChange={handleChange}
              placeholder="Enter pharma leader"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
              required
            />
          </div>

          {/* Institution */}
          <div>
            <label className="block text-black font-medium mb-2">
              Institution
            </label>
            <input
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              placeholder="Enter institution name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
              required
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-black font-medium mb-2">
              Department
            </label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Enter department name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-black font-medium mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Write a short biography"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-black h-32 resize-none"
              required
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="bg-bg text-white py-2 px-6 rounded-lg cursor-pointer"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Leader"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdateLeader;
