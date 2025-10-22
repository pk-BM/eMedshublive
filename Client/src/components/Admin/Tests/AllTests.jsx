import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { GetAllTests, DeleteTest } from "../../../lib/APIs/testAPI";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoEyeSharp } from "react-icons/io5";
import { toast } from "react-toastify";

const AllTests = () => {
  const [loading, setLoading] = useState(false);
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]); // for search
  const [showModal, setShowModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch All Tests
  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await GetAllTests();
      const data = response.data || response;
      setTests(data);
      setFilteredTests(data);
    } catch (error) {
      toast.error(`Error fetching tests: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  // ✅ Handle delete click
  const handleDeleteClick = (test) => {
    setSelectedTest(test);
    setShowModal(true);
  };

  // ✅ Confirm delete (calls backend)
  const confirmDelete = async () => {
    try {
      setLoading(true);
      await DeleteTest(selectedTest._id);
      toast.success("Medical test deleted successfully!");
      setShowModal(false);
      setSelectedTest(null);
      fetchTests();
    } catch (error) {
      toast.error(`Error deleting test: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Search Logic
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredTests(tests);
    } else {
      const filtered = tests.filter((test) =>
        test.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTests(filtered);
    }
  }, [searchTerm, tests]);

  return (
    <>
      <div className="w-full max-w-[84vw] mx-auto p-4">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Search medical test by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-3 w-full max-w-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          />
          <Link
            to="/admin/medical-test/create"
            className="bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-5 rounded-md shadow-sm transition-all"
          >
            Create Test
          </Link>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-10 text-gray-600 text-lg">Loading...</div>
        ) : filteredTests.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-green-50">
                  <tr>
                    {["#", "Name", "Trusted Centers", "Active", "Image", "Actions"].map(
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
                  {filteredTests.map((test, index) => (
                    <tr key={test._id || index} className="hover:bg-green-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700 text-sm">{index + 1}</td>
                      <td className="px-4 py-2 text-gray-700 text-sm">{test.name}</td>
                      <td className="px-4 py-2 text-gray-700 text-sm">
                        {test.trustedCenters?.length || 0}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            test.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {test.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {test.image ? (
                          <img
                            src={test.image}
                            alt={test.name}
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
                          onClick={() => handleDeleteClick(test)}
                        />
                        <Link to={`/admin/medical-test/update/${test._id}`}>
                          <MdEdit
                            size={20}
                            className="text-green-600 hover:text-green-700 cursor-pointer transition-colors"
                          />
                        </Link>
                        <Link to={`/admin/medical-test/${test._id}`}>
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

            {/* Mobile Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filteredTests.map((test, index) => (
                <div
                  key={test._id || index}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-green-700 font-semibold text-lg">{test.name}</h3>
                    <span className="text-gray-500 text-sm">#{index + 1}</span>
                  </div>
                  {test.image && (
                    <img
                      src={test.image}
                      alt={test.name}
                      className="w-full h-36 object-cover rounded-md border mb-3"
                    />
                  )}
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Description:</strong> {test.description || "—"}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Trusted Centers:</strong> {test.trustedCenters?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    <strong>Status:</strong>{" "}
                    {test.isActive ? (
                      <span className="text-green-600 font-medium">Active</span>
                    ) : (
                      <span className="text-red-500 font-medium">Inactive</span>
                    )}
                  </p>
                  <div className="flex justify-end gap-3">
                    <MdDelete
                      size={20}
                      className="text-green-600 hover:text-green-700 cursor-pointer transition-colors"
                      onClick={() => handleDeleteClick(test)}
                    />
                    <Link to={`/admin/medical-test/update/${test._id}`}>
                      <MdEdit
                        size={20}
                        className="text-green-600 hover:text-green-700 cursor-pointer transition-colors"
                      />
                    </Link>
                    <Link to={`/admin/medical-test/${test._id}`}>
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
            No medical tests available 🧪
          </div>
        )}
      </div>

      {/* ✅ Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg">
            <p className="text-gray-700 text-base text-center mb-8">
              Are you sure you want to delete this test?
              {/* <span className="font-semibold text-green-700">{selectedTest?.name}</span>? */}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-md px-4 py-2 text-sm transition-all"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={confirmDelete}
                className="bg-green-600 text-white hover:bg-green-700 rounded-md px-4 py-2 text-sm transition-all disabled:opacity-70"
              >
                {loading ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllTests;
