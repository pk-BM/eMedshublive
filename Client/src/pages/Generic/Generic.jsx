import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { MdOutlineMedicalServices } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { GetGenerics } from "../../lib/APIs/genericAPI";
import Pagination from "../../components/Layout/Pagination";

const Generic = () => {
  const [generics, setGenerics] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchGenerics = async () => {
    try {
      setLoading(true);
      const response = await GetGenerics();
      setGenerics(response?.data || []);
    } catch (error) {
      toast.error("Error fetching generics");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenerics();
  }, []);

  const filteredGenerics = generics.filter((generic) =>
    generic.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredGenerics.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-10 font-inter">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 border-b-2 border-green-200 pb-4">
        <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
          <MdOutlineMedicalServices className="text-[#34d399] text-3xl" />
          <span className="tracking-wide">
            Generics
          </span>
        </h2>

        {/* Right Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <IoSearch className="absolute top-2.5 left-3 text-[#34d399] text-lg" />
            <input
              type="text"
              placeholder="Search generics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-green-300 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-[#34d399] focus:outline-none transition-all bg-white"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-center text-gray-600 text-sm">Loading generics...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGenerics.length > 0 ? (
            currentItems.map((generic, index) => (
              <Link
                to={`/generics/${generic._id}`}
                key={index}
                className="block"
              >
                <div className="flex flex-col bg-white border border-green-100 rounded-lg p-4 transition-all duration-300 cursor-pointer hover:bg-[#34d399] hover:text-white hover:shadow-lg">
                  <span className="text-base text-slate-800 font-medium leading-snug transition-colors duration-300 hover:text-white">
                    {generic.name}
                  </span>
                  <span className="text-sm text-gray-500 mt-1 transition-colors duration-300 hover:text-white">
                    {generic.availableBrands
                      ? `${generic.availableBrands} available brands`
                      : "0 available brands"}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 text-sm">
              No generics found.
            </p>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-10">
        <Pagination
          currentPage={currentPage}
          totalItems={filteredGenerics.length}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default Generic;
