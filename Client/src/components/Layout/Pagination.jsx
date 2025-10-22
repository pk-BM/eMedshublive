import React from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      {/* Previous Button */}
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-1.5 border border-[#34d399] rounded-md text-[#34d399] hover:bg-[#34d399] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      >
        <MdChevronLeft /> Prev
      </button>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index + 1)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-all duration-300 ${
            currentPage === index + 1
              ? "bg-[#34d399] text-white border-[#34d399]"
              : "bg-white text-[#34d399] border-[#34d399] hover:bg-[#34d399] hover:text-white"
          }`}
        >
          {index + 1}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-1.5 border border-[#34d399] rounded-md text-[#34d399] hover:bg-[#34d399] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      >
        Next <MdChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
