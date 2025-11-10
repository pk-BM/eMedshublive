import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Pagination from "../../components/Layout/Pagination.jsx";
import { GetLeaders } from "../../lib/APIs/leaderAPI.js";

const GetAllLeaders = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // ✅ Show 4 per row (4x2 grid per page)

  const fetchLeaders = async () => {
    try {
      setLoading(true);
      const response = await GetLeaders();
      setLeaders(response?.data || []);
    } catch (error) {
      console.error("Error fetching leaders:", error);
      toast.error("Failed to fetch leaders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaders();
  }, []);

  const filteredData = leaders.filter((leader) =>
    leader.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
// <div className="min-h-screen bg-gradient-to-b from-[#ecfdf5] via-white to-[#f9fafb] px-6 py-12 font-inter">
    <div className="min-h-screen px-6 py-12 font-inter">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-6 border-b border-emerald-200 pb-5"
      >
        <h2 className="text-3xl font-bold text-gray-800">
          Meet Our <span className="text-emerald-600">Leaders</span>
        </h2>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <IoSearch className="absolute top-2.5 left-3 text-emerald-500 text-lg" />
          <input
            type="text"
            placeholder="Search leaders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-emerald-300 rounded-full pl-10 pr-4 py-2.5 text-sm text-gray-700 
            focus:ring-2 focus:ring-emerald-400 focus:outline-none transition-all bg-white shadow-sm"
          />
        </div>
      </motion.div>

      {/* Leader Cards Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        {loading ? (
          <p className="text-center text-gray-600 text-lg py-10">
            Loading leaders...
          </p>
        ) : currentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentItems.map((leader, index) => (
              <motion.div
                key={leader._id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
              >
                <Link
                  to={`/leaders/${leader._id}`}
                  className="group relative bg-white border border-emerald-100 rounded-2xl shadow-md 
                  hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Image */}
                  <div className="relative w-full h-56 overflow-hidden">
                    <img
                      src={leader.profilePicture || "/default-profile.png"}
                      alt={leader.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  {/* Info */}
                  <div className="p-4 text-center">
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                      {leader.name}
                    </h3>
                    <p className="text-sm text-gray-600">{leader.designation}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg py-10">
            No leaders available at the moment.
          </p>
        )}
      </motion.div>

      {/* Pagination */}
      <div className="mt-12 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default GetAllLeaders;
