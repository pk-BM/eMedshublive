// export default Pharmaceuticals;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BrandCard from "../../components/Drugs/BrandCard";
import { GetAllPharmaceutical } from "../../lib/APIs/pharmaceuticalAPI";
import { MdOutlineMedicalServices } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { toast } from "react-toastify";
import Pagination from "../../components/Layout/Pagination";

const Pharmaceuticals = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ✅ Fetch pharmaceuticals data
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await GetAllPharmaceutical();
        if (response?.success && Array.isArray(response.data)) {
          setBrands(response.data);
        } else {
          toast.error("Invalid data received from server");
        }
      } catch (error) {
        toast.error("Error fetching Pharmaceuticals");
        console.error("Error fetching Pharmaceutical:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  // ✅ Search Filter
  const filteredData = brands.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.generic?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Pagination Logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 px-6 md:px-28 py-10 font-inter">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 border-b-2 border-green-200 pb-4">
        <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
          <span className="tracking-wide">
            List of Pharmaceutical Companies
          </span>
        </h2>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <IoSearch className="absolute top-2.5 left-3 text-[#34d399] text-lg" />
          <input
            type="text"
            placeholder="Search pharmaceuticals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-green-300 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-[#34d399] focus:outline-none transition-all bg-white"
          />
        </div>
      </div>

      {/* Loading / Empty / Data */}
      {loading ? (
        <p className="text-gray-500 mx-auto text-center py-10">
          Loading Pharmaceuticals...
        </p>
      ) : filteredData.length === 0 ? (
        <p className="text-gray-500 mx-auto text-center py-10">
          No Pharmaceuticals found.
        </p>
      ) : (
        <div className="grid col-span-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {currentItems.map((pharmaceutical, index) => (
            <Link
              key={index}
              to={`/pharmaceuticals/${pharmaceutical._id}`}
              className="cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <BrandCard
                packImage={pharmaceutical.logo}
                name={pharmaceutical.name || "Unnamed"}
                generic={`${pharmaceutical.totalGenerics || 0} Generics`}
              />
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-10 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Pharmaceuticals;
