import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  GetAllDoctorAdvices,
  DeleteDoctorAdvice,
} from "../../../lib/APIs/doctorAdviceAPI";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoEyeSharp } from "react-icons/io5";
import { toast } from "react-toastify";

const AllDoctors = () => {
  const [loading, setLoading] = useState(false);
  const [doctorAdvices, setDoctorAdvices] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchDoctorAdvices = async () => {
    try {
      setLoading(true);
      const response = await GetAllDoctorAdvices();
      setDoctorAdvices(response?.data || []);
    } catch (error) {
      console.error("Error fetching doctor advices:", error);
      console.error("Failed to fetch doctor advice");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorAdvices();
  }, []);

  // ✅ Filtered data
  const filteredData = doctorAdvices.filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Delete confirmation
  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await DeleteDoctorAdvice(deleteId);
      toast.success("Doctor advice deleted successfully!");
      fetchDoctorAdvices();
    } catch (error) {
      toast.error("Failed to delete doctor advice");
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-[84vw] mx-auto p-4">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Search doctor advice by title..."
            className="border border-gray-300 rounded-md py-2 px-3 w-full max-w-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Link
            to="/admin/doctors/create"
            className="bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-5 rounded-md shadow-sm transition-all"
          >
            Create Doctor Advice
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-10 text-gray-600 text-lg">
            Loading...
          </div>
        ) : filteredData.length > 0 ? (
          <>
            {/* Table for Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-green-50">
                  <tr>
                    {["#", "Title", "Link", "Status", "Image", "Actions"].map(
                      (heading) => (
                        <th
                          key={heading}
                          className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200"
                        >
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredData.map((item, index) => (
                    <tr
                      key={item._id || index}
                      className="hover:bg-green-50 transition-colors"
                    >
                      <td className="px-4 py-2 text-gray-700 text-sm">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 text-gray-700 text-sm">
                        {item.title}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {item.link ? (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            Open
                          </a>
                        ) : (
                          <span className="text-gray-400">No link</span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
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
                          onClick={() => {
                            setDeleteId(item._id);
                            setShowDeleteModal(true);
                          }}
                        />
                        <Link to={`/admin/doctors/update/${item._id}`}>
                          <MdEdit
                            size={20}
                            className="text-green-600 hover:text-green-700 cursor-pointer transition-colors"
                          />
                        </Link>
                        <Link to={`/admin/view-doctor-advice/${item._id}`}>
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
              {filteredData.map((item, index) => (
                <div
                  key={item._id || index}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-green-700 font-semibold text-lg">
                      {item.title}
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
                    <strong>Link:</strong>{" "}
                    {item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Open
                      </a>
                    ) : (
                      "No link"
                    )}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Status:</strong>{" "}
                    {item.isActive ? "✅ Active" : "❌ Inactive"}
                  </p>
                  <div className="flex justify-end gap-3">
                    <MdDelete
                      size={20}
                      className="text-green-600 hover:text-green-700 cursor-pointer transition-colors"
                      onClick={() => {
                        setDeleteId(item._id);
                        setShowDeleteModal(true);
                      }}
                    />
                    <Link to={`/admin/doctors/update/${item._id}`}>
                      <MdEdit
                        size={20}
                        className="text-green-600 hover:text-green-700 cursor-pointer transition-colors"
                      />
                    </Link>
                    <Link to={`/admin/view-doctor-advice/${item._id}`}>
                      <IoEyeSharp
                        size={20}
                        className="text-green-600 hover:text-green-700 cursor-pointer transition-colors"
                      />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-10 text-gray-600 text-lg">
            No doctor advice available 💬
          </div>
        )}
      </div>

      {/* ✅ Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg border border-gray-200">
            <p className="text-gray-800 text-base text-center mb-8 font-medium">
              Are you sure you want to delete this doctor advice?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-md px-5 py-2 text-sm font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="bg-green-600 text-white hover:bg-green-700 rounded-md px-5 py-2 text-sm font-medium transition-all disabled:opacity-70"
              >
                {deleteLoading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllDoctors;