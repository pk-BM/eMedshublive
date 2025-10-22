import React, { useEffect, useState } from "react";
import {
  GetAllAdvertisements,
  DeleteAdvertisement,
} from "../../../lib/APIs/advertisementAPI";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoEyeSharp } from "react-icons/io5";

const AllAdvertisements = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [deleteModel, setDeleteModel] = useState(false);
  const [deleteBrandLoading, setDeleteBrandLoading] = useState(false);
  const [deleteBrandsId, setDeleteBrandsId] = useState("");

  // ✅ Fetch all advertisements
  const fetchAdvertisements = async () => {
    try {
      setLoading(true);
      const res = await GetAllAdvertisements();
      setAdvertisements(res.data || []);
    } catch (error) {
      toast.error("Failed to fetch advertisements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  // ✅ Handle delete button click
  const handleDelete = (id) => {
    setDeleteModel(true);
    setDeleteBrandsId(id);
  };

  // ✅ Delete Advertisement
  const deleteBrands = async () => {
    try {
      if (!deleteBrandsId) return;
      setDeleteBrandLoading(true);
      const response = await DeleteAdvertisement(deleteBrandsId);
      toast.success(response.message || "Advertisement deleted successfully");
      fetchAdvertisements();
      setDeleteModel(false);
      setDeleteBrandsId("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete advertisement"
      );
    } finally {
      setDeleteBrandLoading(false);
    }
  };

  // ✅ Filtered data
  const filteredAds = advertisements.filter((item) =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-[84vw] mx-auto p-4">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search advertisements by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md py-2 px-3 w-full max-w-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
        />
        <Link
          to="/admin/advertisement/create"
          className="bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-5 rounded-md shadow-sm transition-all"
        >
          Create Advertisement
        </Link>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-10 text-gray-600 text-lg">
          Loading...
        </div>
      ) : filteredAds.length > 0 ? (
        <>
          {/* Table for Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-green-50">
                <tr>
                  {[
                    "#",
                    "Title",
                    "Published Date",
                    "Unpublished Date",
                    "Image",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAds.map((item, index) => (
                  <tr
                    key={item._id || index}
                    className="hover:bg-green-50 transition-colors"
                  >
                    <td className="px-4 py-2 text-gray-700 text-sm">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 text-gray-700 text-sm">
                      {item.title || "Untitled"}
                    </td>
                    <td className="px-4 py-2 text-gray-700 text-sm">
                      {item.publishedDate
                        ? new Date(item.publishedDate).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-2 text-gray-700 text-sm">
                      {item.unpublishedDate
                        ? new Date(item.unpublishedDate).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-2">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-14 h-14 object-cover rounded-md border border-gray-300"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">No image</span>
                      )}
                    </td>
                    <td className="px-4 py-2 flex items-center gap-3">
                      <MdDelete
                        size={20}
                        className="text-green-600 hover:text-green-700 cursor-pointer transition-colors"
                        onClick={() => handleDelete(item._id)}
                      />
                      <Link to={`/admin/advertisement/update/${item._id}`}>
                        <MdEdit
                          size={20}
                          className="text-green-600 hover:text-green-700 cursor-pointer transition-colors"
                        />
                      </Link>
                      <Link to={`/advertisement/view/${item._id}`}>
                        <IoEyeSharp
                          size={20}
                          className="text-green-600 hover:text-green-700 cursor-pointer transition-colors"
                        />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards for Mobile */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredAds.map((item, index) => (
              <div
                key={item._id || index}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-green-700 font-semibold text-lg">
                    {item.title || "Untitled"}
                  </h3>
                  <span className="text-gray-500 text-sm">#{index + 1}</span>
                </div>
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-36 object-cover rounded-md border mb-3"
                  />
                )}
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Published:</strong>{" "}
                  {item.publishedDate
                    ? new Date(item.publishedDate).toLocaleDateString()
                    : "—"}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  <strong>Unpublished:</strong>{" "}
                  {item.unpublishedDate
                    ? new Date(item.unpublishedDate).toLocaleDateString()
                    : "—"}
                </p>
                <div className="flex justify-end gap-3">
                  <Link to={`/advertisement/view/${item._id}`}>
                    <IoEyeSharp
                      size={20}
                      className="text-green-600 hover:text-green-700 cursor-pointer transition-colors"
                    />
                  </Link>
                  <Link to={`/admin/advertisement/update/${item._id}`}>
                    <MdEdit
                      size={20}
                      className="text-green-600 hover:text-green-700 cursor-pointer transition-colors"
                    />
                  </Link>
                  <MdDelete
                    size={20}
                    className="text-green-600 hover:text-green-700 cursor-pointer transition-colors"
                    onClick={() => handleDelete(item._id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-10 text-gray-600 text-lg">
          No advertisements available 📢
        </div>
      )}

      {/* 🗑️ Delete Confirmation Modal */}
      {deleteModel && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg">
            <p className="text-gray-700 text-base text-center mb-8">
              Are you sure you want to delete this advertisement?
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setDeleteModel(false)}
                className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-md px-4 py-2 text-sm transition-all"
              >
                Cancel
              </button>
              <button
                disabled={deleteBrandLoading}
                onClick={deleteBrands}
                className="bg-green-600 text-white hover:bg-green-700 rounded-md px-4 py-2 text-sm transition-all disabled:opacity-70"
              >
                {deleteBrandLoading ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAdvertisements;
