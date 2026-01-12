import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { GetBrandsByManufacturer } from "../../lib/APIs/brandsAPI";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  FaIndustry,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { MdOutlineMedicalServices } from "react-icons/md";

const ManufacturerBrands = () => {
  const { manufacturerId } = useParams();
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [manufacturerName, setManufacturerName] = useState("");

  const fetchBrands = async (page = 1) => {
    try {
      setLoading(true);
      const response = await GetBrandsByManufacturer(manufacturerId, page, 30);

      if (response?.success && response?.data) {
        setBrands(response.data.brands || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalCount(response.data.totalCount || 0);
        setCurrentPage(response.data.currentPage || 1);

        if (response.data.brands && response.data.brands.length > 0) {
          setManufacturerName(response.data.brands[0]?.manufacturer?.name || "Manufacturer");
        }
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch brands for this manufacturer."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands(currentPage);
  }, [manufacturerId, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg">
        Loading brands...
      </div>
    );
  }

  if (!brands || brands.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-red-500 text-lg mb-4">
          No brands found for this manufacturer.
        </div>
        <button
          onClick={() => navigate(-1)}
          className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-xl transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header Section */}
        <div className="mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4">
            <FaIndustry className="text-teal-600 text-3xl sm:text-4xl" />
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-teal-700 mb-1">
                {manufacturerName}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Total {totalCount} {totalCount === 1 ? "brand" : "brands"} available
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-2 transition-colors"
          >
            <FaChevronLeft className="text-sm" />
            Back to Brand Details
          </button>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {brands.map((brand, index) => (
            <motion.div
              key={brand._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
            >
              <Link
                to={`/brands/${brand._id}`}
                className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-teal-200 group"
              >
                {/* Image Section */}
                <div className="relative bg-gray-50 h-40 sm:h-48 flex items-center justify-center overflow-hidden">
                  <img
                    src={
                      brand.packImage && brand.packImage.trim() !== ""
                        ? brand.packImage
                        : "/no-image.png"
                    }
                    alt={brand.name}
                    className="max-h-full max-w-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content Section */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-start gap-2 mb-3">
                    <MdOutlineMedicalServices className="text-teal-600 text-xl flex-shrink-0 mt-0.5" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-teal-700 transition-colors">
                      {brand.name}
                    </h3>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    {brand.productType && (
                      <div className="flex justify-between">
                        <span className="font-medium">Type:</span>
                        <span className="text-gray-700">{brand.productType}</span>
                      </div>
                    )}
                    {brand.strength && (
                      <div className="flex justify-between">
                        <span className="font-medium">Strength:</span>
                        <span className="text-gray-700">{brand.strength}</span>
                      </div>
                    )}
                    {brand.unitPrice && (
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Unit Price:</span>
                        <span className="text-teal-700 font-semibold">
                          Rs. {brand.unitPrice}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-xl shadow-md">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-teal-600 text-white hover:bg-teal-700"
                }`}
              >
                <FaChevronLeft className="text-sm" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <div className="flex items-center gap-1 sm:gap-2">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  // Show first, last, current, and adjacent pages
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg transition-all text-sm sm:text-base ${
                          currentPage === pageNum
                            ? "bg-teal-600 text-white font-semibold"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (
                    pageNum === currentPage - 2 ||
                    pageNum === currentPage + 2
                  ) {
                    return (
                      <span key={pageNum} className="text-gray-400 px-1">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-teal-600 text-white hover:bg-teal-700"
                }`}
              >
                <span className="hidden sm:inline">Next</span>
                <FaChevronRight className="text-sm" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ManufacturerBrands;
