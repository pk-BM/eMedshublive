import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  GetAllTrustedCenters,
  DeleteTrustedCenter,
} from "../../../lib/APIs/TrustedCenterAPI";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoEyeSharp } from "react-icons/io5";
import { toast } from "react-toastify";

const AllTrustedCenter = () => {
  const [loading, setLoading] = useState(false);
  const [centers, setCenters] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ new state
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteCenterLoading, setDeleteCenterLoading] = useState(false);
  const [deleteCenterId, setDeleteCenterId] = useState("");

  const fetchCenters = async () => {
    try {
      setLoading(true);
      const response = await GetAllTrustedCenters();
      setCenters(response.data);
    } catch (error) {
      console.error("Error fetching trusted centers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  const handleDelete = (id) => {
    setDeleteModal(true);
    setDeleteCenterId(id);
  };

  const deleteCenter = async () => {
    try {
      if (!deleteCenterId) return;
      setDeleteCenterLoading(true);
      const response = await DeleteTrustedCenter(deleteCenterId);
      fetchCenters();
      toast.success(response.message || "Trusted Center deleted successfully!");
      setDeleteModal(false);
      setDeleteCenterId("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete");
    } finally {
      setDeleteCenterLoading(false);
    }
  };

  // ✅ Filtered list based on search term
  const filteredCenters = centers.filter((center) =>
    center.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="w-full max-w-[84vw] mx-auto p-4">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Search centers by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // ✅ update search
            className="border border-gray-300 rounded-md py-2 px-3 w-full max-w-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          />
          <Link
            to="/admin/trusted-center/create"
            className="bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-5 rounded-md shadow-sm transition-all"
          >
            Create Trusted Center
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-10 text-gray-600 text-lg">Loading...</div>
        ) : filteredCenters.length > 0 ? (
          <>
            {/* Table for Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-green-50">
                  <tr>
                    {["#", "Name", "Logo", "Actions"].map((heading) => (
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
                  {filteredCenters.map((center, index) => (
                    <tr
                      key={center._id || index}
                      className="hover:bg-green-50 transition-colors"
                    >
                      <td className="px-4 py-2 text-gray-700 text-sm">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 text-gray-700 text-sm">
                        {center.name}
                      </td>
                      <td className="px-4 py-2">
                        {center.logo ? (
                          <img
                            src={center.logo}
                            alt={center.name}
                            className="w-14 h-14 object-cover rounded-md border border-gray-300"
                          />
                        ) : (
                          <span className="text-gray-400 text-sm">No logo</span>
                        )}
                      </td>
                      <td className="px-4 py-2 flex items-center gap-3">
                        <MdDelete
                          size={20}
                          className="text-green-600 hover:text-green-700 cursor-pointer transition-colors"
                          onClick={() => handleDelete(center._id)}
                        />
                        <Link to={`/admin/trusted-center/update/${center._id}`}>
                          <MdEdit
                            size={20}
                            className="text-green-600 hover:text-green-700 cursor-pointer transition-colors"
                          />
                        </Link>
                        <Link to={`/trusted-center/${center._id}`}>
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
              {filteredCenters.map((center, index) => (
                <div
                  key={center._id || index}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-green-700 font-semibold text-lg">
                      {center.name}
                    </h3>
                    <span className="text-gray-500 text-sm">#{index + 1}</span>
                  </div>
                  {center.logo && (
                    <img
                      src={center.logo}
                      alt={center.name}
                      className="w-full h-36 object-cover rounded-md border mb-3"
                    />
                  )}
                  <div className="flex justify-end gap-3">
                    <MdDelete
                      size={20}
                      className="text-green-600 hover:text-green-700 cursor-pointer transition-colors"
                      onClick={() => handleDelete(center._id)}
                    />
                    <Link to={`/admin/trusted-center/update/${center._id}`}>
                      <MdEdit
                        size={20}
                        className="text-green-600 hover:text-green-700 cursor-pointer"
                      />
                    </Link>
                    <Link to={`/trusted-center/${center._id}`}>
                      <IoEyeSharp
                        size={20}
                        className="text-green-600 hover:text-green-700 cursor-pointer"
                      />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-10 text-gray-600 text-lg">
            No trusted centers found 🏥
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg text-center">
            <p className="text-gray-700 text-base mb-6">
              Are you sure you want to delete this Trusted Center?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteModal(false)}
                className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-md px-4 py-2 text-sm transition-all"
              >
                Cancel
              </button>
              <button
                disabled={deleteCenterLoading}
                onClick={deleteCenter}
                className="bg-green-600 text-white hover:bg-green-700 rounded-md px-4 py-2 text-sm transition-all disabled:opacity-70"
              >
                {deleteCenterLoading ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllTrustedCenter;
