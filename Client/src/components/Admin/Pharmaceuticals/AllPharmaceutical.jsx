import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  GetAllPharmaceutical,
  deletePharmaceutical,
} from "../../../lib/APIs/pharmaceuticalAPI";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoEyeSharp } from "react-icons/io5";
import { toast } from "react-toastify";

const AllPharmaceuticals = () => {
  const [loading, setLoading] = useState(false);
  const [pharmaceuticals, setPharmaceuticals] = useState([]);
  const [deleteModel, setDeleteModel] = useState(false);
  const [deleteNewsLoading, setDeleteNewsLoading] = useState(false);
  const [deletePharmaceuticalId, setDeletePharmaceuticalId] = useState("");
  const [search, setSearch] = useState(""); // ✅ Added search state

  // 🔹 Fetch all pharmaceuticals
  const fetchPharmaceuticals = async () => {
    try {
      setLoading(true);
      const response = await GetAllPharmaceutical();
      setPharmaceuticals(response.data || []);
    } catch (error) {
      console.error("Error fetching pharmaceuticals:", error);
      toast.error("Failed to fetch pharmaceuticals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmaceuticals();
  }, []);

  // 🔹 Handle delete
  const handleDelete = (id) => {
    setDeleteModel(true);
    setDeletePharmaceuticalId(id);
  };

  const deletePharma = async () => {
    try {
      if (!deletePharmaceuticalId) return;
      setDeleteNewsLoading(true);
      const response = await deletePharmaceutical(deletePharmaceuticalId);
      toast.success(response.message || "Pharmaceutical deleted successfully!");
      fetchPharmaceuticals(); // ✅ refresh list
      setDeleteModel(false);
      setDeletePharmaceuticalId("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete pharmaceutical"
      );
    } finally {
      setDeleteNewsLoading(false);
    }
  };

  // 🔹 Filtered data based on search
  const filteredPharmaceuticals = pharmaceuticals.filter((pharma) =>
    pharma.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="w-full max-w-[84vw] mx-auto p-4">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Search pharmaceuticals by name..."
            className="border border-gray-300 rounded-md py-2 px-3 w-full max-w-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Link
            to="/admin/pharmaceuticals/create"
            className="bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-5 rounded-md shadow-sm transition-all"
          >
            Create Pharmaceutical
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-10 text-gray-600 text-lg">Loading...</div>
        ) : filteredPharmaceuticals.length > 0 ? (
          <>
            {/* Table for Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-green-50">
                  <tr>
                    {[
                      "#",
                      "Name",
                      "Total Generics",
                      "Contact",
                      "Active",
                      "Logo",
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
                  {filteredPharmaceuticals.map((pharma, index) => (
                    <tr
                      key={pharma._id || index}
                      className="hover:bg-green-50 transition-colors"
                    >
                      <td className="px-4 py-2 text-gray-700 text-sm">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 text-gray-700 text-sm">
                        {pharma.name}
                      </td>
                      <td className="px-4 py-2 text-gray-700 text-sm">
                        {pharma.totalGenerics ?? "—"}
                      </td>
                      <td className="px-4 py-2 text-gray-700 text-sm">
                        {pharma.contactDetails || "—"}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            pharma.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {pharma.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {pharma.logo ? (
                          <img
                            src={pharma.logo}
                            alt={pharma.name}
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
                          onClick={() => handleDelete(pharma._id)}
                        />
                        <Link to={`/admin/pharmaceuticals/update/${pharma._id}`}>
                          <MdEdit
                            size={20}
                            className="text-green-600 hover:text-green-700 cursor-pointer transition-colors"
                          />
                        </Link>
                        <Link to={`/admin/pharmaceuticals/${pharma._id}`}>
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
              {filteredPharmaceuticals.map((pharma, index) => (
                <div
                  key={pharma._id || index}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-green-700 font-semibold text-lg">
                      {pharma.name}
                    </h3>
                    <span className="text-gray-500 text-sm">#{index + 1}</span>
                  </div>
                  {pharma.logo && (
                    <img
                      src={pharma.logo}
                      alt={pharma.name}
                      className="w-full h-36 object-cover rounded-md border mb-3"
                    />
                  )}
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Total Generics:</strong> {pharma.totalGenerics ?? "—"}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Contact:</strong> {pharma.contactDetails || "—"}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Address:</strong> {pharma.address || "—"}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    <strong>Status:</strong>{" "}
                    {pharma.isActive ? (
                      <span className="text-green-600 font-medium">Active</span>
                    ) : (
                      <span className="text-red-500 font-medium">Inactive</span>
                    )}
                  </p>
                  <div className="flex justify-end gap-3">
                    <MdDelete
                      size={20}
                      className="text-green-600 hover:text-green-700 cursor-pointer transition-colors"
                      onClick={() => handleDelete(pharma._id)}
                    />
                    <Link to={`/admin/pharmaceuticals/update/${pharma._id}`}>
                      <MdEdit
                        size={20}
                        className="text-green-600 hover:text-green-700 cursor-pointer transition-colors"
                      />
                    </Link>
                    <Link to={`/admin/pharmaceuticals/${pharma._id}`}>
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
            No pharmaceuticals available 💊
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModel && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg">
            <p className="text-gray-700 text-base text-center mb-8">
              Are you sure you want to delete this Pharmaceutical?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteModel(false)}
                className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-md px-4 py-2 text-sm transition-all"
              >
                Cancel
              </button>
              <button
                disabled={deleteNewsLoading}
                onClick={deletePharma}
                className="bg-green-600 text-white hover:bg-green-700 rounded-md px-4 py-2 text-sm transition-all disabled:opacity-70"
              >
                {deleteNewsLoading ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllPharmaceuticals;
