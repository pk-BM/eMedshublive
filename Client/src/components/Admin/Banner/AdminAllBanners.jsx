import React, { useEffect, useState } from "react";
import { GetAllBanners, DeleteBanner } from "../../../lib/APIs/bannerAPI";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoEyeSharp } from "react-icons/io5";

const AdminAllBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteBannerLoading, setDeleteBannerLoading] = useState(false);
  const [deleteBannerId, setDeleteBannerId] = useState("");

  // ✅ Fetch all banners
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await GetAllBanners();
      setBanners(res.data || []);
      console.log(res.data)
    } catch (error) {
      console.error("Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // ✅ Handle delete click
  const handleDelete = (id) => {
    setDeleteModal(true);
    setDeleteBannerId(id);
  };

  // ✅ Delete banner
  const deleteSelectedBanner = async () => {
    try {
      if (!deleteBannerId) return;
      setDeleteBannerLoading(true);
      const response = await DeleteBanner(deleteBannerId);
      toast.success(response.message || "Banner deleted successfully");
      fetchBanners();
      setDeleteModal(false);
      setDeleteBannerId("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete banner");
    } finally {
      setDeleteBannerLoading(false);
    }
  };


  return (
    <div className="w-full max-w-[84vw] mx-auto p-4">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <h1 className="text-lg font-medium">Banners</h1>
        <Link
          to="/admin/banner/create"
          className="bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-5 rounded-md shadow-sm transition-all"
        >
          Create Banner
        </Link>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="text-center py-10 text-gray-600 text-lg">Loading...</div>
      ) : banners.length > 0 ? (
        <>
          {/* Table for Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-green-50">
                <tr>
                  {["#", "Image", "Actions"].map((heading) => (
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
                {banners.map((item, index) => (
                  <tr
                    key={item._id || index}
                    className="hover:bg-green-50 transition-colors"
                  >
                    <td className="px-4 py-2 text-gray-700 text-sm">{index + 1}</td>
                    <td className="px-4 py-2">
                      {item.bannerImgUrl ? (
                        <img
                          src={item.bannerImgUrl}
                          alt={item._id}
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
                      <Link to={`/admin/banner/update/${item._id}`}>
                        <MdEdit
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
            {banners.map((item, index) => (
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
                {item.bannerImg && (
                  <img
                    src={item.bannerImg}
                    alt={item.title}
                    className="w-full h-36 object-cover rounded-md border mb-3"
                  />
                )}
                <div className="flex justify-end gap-3">
                  <Link to={`/banner/view/${item._id}`}>
                    <IoEyeSharp
                      size={20}
                      className="text-green-600 hover:text-green-700 cursor-pointer transition-colors"
                    />
                  </Link>
                  <Link to={`/admin/banner/update/${item._id}`}>
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
          No banners available 📢
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg">
            <p className="text-gray-700 text-base text-center mb-8">
              Are you sure you want to delete this banner?
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setDeleteModal(false)}
                className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-md px-4 py-2 text-sm transition-all"
              >
                Cancel
              </button>
              <button
                disabled={deleteBannerLoading}
                onClick={deleteSelectedBanner}
                className="bg-green-600 text-white hover:bg-green-700 rounded-md px-4 py-2 text-sm transition-all disabled:opacity-70"
              >
                {deleteBannerLoading ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAllBanners;
