import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { MdDelete, MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import { DeleteLeader, GetLeaders } from "../../../lib/APIs/leaderAPI"

const AllLeader = () => {
  const [loading, setLoading] = useState(false);
  const [leaders, setLeaders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModel, setDeleteModel] = useState(false);
  const [deleteLeaderId, setDeleteLeaderId] = useState("");
  const [deleteLeaderLoading, setDeleteLeaderLoading] = useState(false);

  const fetchLeaders = async () => {
    try {
      setLoading(true);
      const response = await GetLeaders();
      setLeaders(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaders();
  }, []);

  const handleDelete = (id) => {
    setDeleteModel(true);
    setDeleteLeaderId(id);
  };

  const deleteLeader = async () => {
    try {
      if (!deleteLeaderId) return;
      setDeleteLeaderLoading(true);
      const response = await DeleteLeader(deleteLeaderId);
      toast.success(response.message);
      fetchLeaders();
      setDeleteModel(false);
      setDeleteLeaderId("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete leader");
    } finally {
      setDeleteLeaderLoading(false);
    }
  };

  // ✅ Filter leaders by name
  const filteredLeaders = leaders.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="w-full max-w-[84vw] mx-auto p-4">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Search leader by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-3 w-full max-w-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          />
          <Link
            to="/admin/leaders/create"
            className="bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-5 rounded-md shadow-sm transition-all"
          >
            Add Leader
          </Link>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-10 text-gray-600 text-lg">Loading...</div>
        ) : filteredLeaders.length > 0 ? (
          <>
            {/* Table View for Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-green-50">
                  <tr>
                    {["#", "Profile Picture", "Name", "Designation", "Actions"].map((heading) => (
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
                  {filteredLeaders.map((item, index) => (
                    <tr key={item._id || index} className="hover:bg-green-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700 text-sm">{index + 1}</td>
                      <td className="px-4 py-2">
                        <img
                          src={item.profilePicture}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded-full border border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-2 text-gray-700 text-sm">{item.name}</td>
                      <td className="px-4 py-2 text-gray-700 text-sm">{item.designation}</td>
                      <td className="px-4 py-2 flex items-center gap-3">
                        <MdDelete
                          size={20}
                          className="text-green-600 hover:text-green-700 cursor-pointer transition-colors"
                          onClick={() => handleDelete(item._id)}
                        />
                        <Link to={`/admin/leaders/update/${item._id}`}>
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

            {/* Card View for Mobile */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filteredLeaders.map((item, index) => (
                <div
                  key={item._id || index}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={item.profilePicture}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-full border"
                    />
                    <div>
                      <h3 className="text-green-700 font-semibold text-lg">{item.name}</h3>
                      <p className="text-gray-600 text-sm">{item.designation}</p>
                    </div>
                    <span className="ml-auto text-gray-500 text-sm">#{index + 1}</span>
                  </div>
                  <div className="flex justify-end gap-3">
                    <MdDelete
                      size={20}
                      className="text-green-600 hover:text-green-700 cursor-pointer"
                      onClick={() => handleDelete(item._id)}
                    />
                    <Link to={`/admin/leader/update/${item._id}`}>
                      <MdEdit size={20} className="text-green-600 hover:text-green-700 cursor-pointer" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-10 text-gray-600 text-lg">
            No leaders found matching your search 🧑‍💼
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModel && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg">
            <p className="text-gray-700 text-base text-center mb-8">
              Are you sure you want to delete this leader?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteModel(false)}
                className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-md px-4 py-2 text-sm transition-all"
              >
                Cancel
              </button>
              <button
                disabled={deleteLeaderLoading}
                onClick={deleteLeader}
                className="bg-green-600 text-white hover:bg-green-700 rounded-md px-4 py-2 text-sm transition-all disabled:opacity-70"
              >
                {deleteLeaderLoading ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllLeader;
