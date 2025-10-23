import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { MdOutlineMedicalServices } from "react-icons/md";
import { GetAllTests } from "../../lib/APIs/testAPI.js";
import Pagination from "../../components/Layout/Pagination";
import "./TestPage.css";

const TestPage = () => {
  const [testList, setTestList] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // ✅ Fetch All Tests
  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      try {
        const response = await GetAllTests();
        const data = response?.data || [];
        setTestList(data);
        setFilteredTests(data);
      } catch (error) {
        console.error("Error fetching tests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  // ✅ Handle Search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTests(testList);
    } else {
      const filtered = testList.filter((test) =>
        test.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTests(filtered);
    }
    setCurrentPage(1); // Reset to first page after search
  }, [searchTerm, testList]);

  // ✅ Pagination Logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredTests.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-10 font-inter">
      {/* ===== Header ===== */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 border-b-2 border-green-200 pb-4">
        <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
          <MdOutlineMedicalServices className="text-[#34d399] text-3xl" />
          <span className="tracking-wide">Medical Tests</span>
        </h2>

        {/* ===== Search Bar ===== */}
        <div className="relative w-full md:w-72">
          <IoSearch className="absolute top-2.5 left-3 text-[#34d399] text-lg" />
          <input
            type="text"
            placeholder="Search tests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-green-300 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-[#34d399] focus:outline-none transition-all bg-white"
          />
        </div>
      </div>

      {/* ===== Content ===== */}
      {loading ? (
        <p className="text-center text-gray-600 text-sm">Loading Medical Tests...</p>
      ) : filteredTests.length === 0 ? (
        <p className="text-center text-gray-500 text-sm">No Medical Tests found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentItems.map((test, index) => (
            <Link key={index} to={`/tests/${test._id}`} className="block">
              <div className="flex flex-col bg-white border border-green-100 rounded-lg p-4 transition-all duration-300 cursor-pointer hover:bg-[#34d399] hover:text-white hover:shadow-lg">
                <span className="text-base text-slate-800 font-medium leading-snug transition-colors duration-300 hover:text-white">
                  {test.name}
                </span>
                {/* ✅ Quill HTML Description Render */}
                <div
                  className="text-sm text-gray-500 mt-1 transition-colors duration-300 hover:text-white line-clamp-3 overflow-hidden"
                  dangerouslySetInnerHTML={{
                    __html: test.description || "<em>No description available</em>",
                  }}
                ></div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ===== Pagination ===== */}
      <div className="mt-10">
        <Pagination
          currentPage={currentPage}
          totalItems={filteredTests.length}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default TestPage;
