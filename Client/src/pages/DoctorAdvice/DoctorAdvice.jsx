import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MdOutlineMedicalServices } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import Pagination from "../../components/Layout/Pagination.jsx";
import { GetAllDoctorAdvices } from "../../lib/APIs/doctorAdviceAPI.js";

const DoctorAdvice = () => {
  const [doctorAdvices, setDoctorAdvices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const fetchDoctorAdvices = async () => {
    try {
      setLoading(true);
      const response = await GetAllDoctorAdvices();
      setDoctorAdvices(response?.data || []);
    } catch (error) {
      console.error("Error fetching doctor advices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorAdvices();
  }, []);

  // ✅ Filter by title
  const filteredData = doctorAdvices.filter((item) =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-10 font-inter">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 border-b-2 border-green-200 pb-4">
        <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
          <MdOutlineMedicalServices className="text-[#34d399] text-3xl" />
          <span className="tracking-wide">Doctor's Advice</span>
        </h2>

        {/* Search Box */}
        <div className="relative w-full md:w-72">
          <IoSearch className="absolute top-2.5 left-3 text-[#34d399] text-lg" />
          <input
            type="text"
            placeholder="Search doctor's advice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-green-300 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-[#34d399] focus:outline-none transition-all bg-white"
          />
        </div>
      </div>

      {/* Advice Cards */}
      <div>
        {loading ? (
          <p className="text-center text-gray-600 text-lg">Loading advice...</p>
        ) : currentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {currentItems.map((advice) => (
              <div
                key={advice._id}
                onClick={() => {
                  if (advice.link) {
                    window.open(advice.link, "_blank"); // ✅ Opens in new tab
                  } else {
                    toast.info("No link available for this advice.");
                  }
                }}
                className="cursor-pointer bg-white border border-green-200 rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden group"
              >
                <div className="w-full h-56 bg-gray-100 overflow-hidden">
                  <img
                    src={
                      advice.image ||
                      "https://via.placeholder.com/400x250?text=No+Image"
                    }
                    alt={advice.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {advice.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg">
            No advice available at the moment.
          </p>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-10">
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

export default DoctorAdvice;
