import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BrandCard from "../../components/Drugs/BrandCard";
import { GetAllBrands } from "../../lib/APIs/brandsAPI";
import { toast } from "react-toastify";
import { MdOutlineMedicalServices } from "react-icons/md";
import { IoSearch } from "react-icons/io5";

const DrugClasses = () => {
  const [selectedClass, setSelectedClass] = useState("All Products");
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const drugCategories = [
    "All Products",
    "New Products",
    "Bioequivalent Products",
    // "Category A",
    // "Category B",
    // "Category C",
    // "Category D",
    // "Category E",
  ];

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await GetAllBrands();
        if (response?.success && Array.isArray(response.data)) {
          setBrands(response.data);
        } else {
          toast.error("Invalid data received from server");
        }
      } catch (error) {
        toast.error("Error fetching brands");
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  // ✅ Apply category and search filters
  const getFilteredBrands = () => {
    let filtered = brands;

    if (selectedClass === "Bioequivalent Products") {
      filtered = brands.filter((item) =>
        item.productType?.toLowerCase().includes("bio equivalent")
      );
    } else if (selectedClass === "New Products") {
      filtered = [...brands]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (brand) =>
          brand.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          brand.generic?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredData = getFilteredBrands();

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-10 font-inter">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b-2 border-[#34d399] pb-5 mb-10">
        <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
          <MdOutlineMedicalServices className="text-[#34d399] text-3xl" />
          <span className="tracking-wide">Brands</span>
        </h2>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <IoSearch className="absolute top-2.5 left-3 text-[#34d399] text-lg" />
          <input
            type="text"
            placeholder="Search brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-[#34d399]/40 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-700 
                       focus:ring-2 focus:ring-[#34d399] focus:outline-none transition-all bg-white"
          />
        </div>
      </div>

      {/* CATEGORY BUTTONS */}
      <div className="flex flex-wrap items-center justify-start gap-3 mb-8">
        {drugCategories.map((drugClass) => (
          <button
            key={drugClass}
            onClick={() => setSelectedClass(drugClass)}
            className={`px-4 py-2 border rounded-md text-sm font-medium transition-all ${
              selectedClass === drugClass
                ? "bg-[#34d399] text-white border-[#34d399]"
                : "border-[#34d399] text-[#34d399] hover:bg-[#34d399]/10"
            }`}
          >
            {drugClass}
          </button>
        ))}
      </div>

      {/* SECTION TITLE */}
      <h3 className="text-xl font-bold text-[#1f2937] mb-6 border-l-4 border-[#34d399] pl-3">
        {selectedClass}
      </h3>

      {/* MAIN CONTENT */}
      {loading ? (
        <p className="text-[#6b7280] text-center">Loading brands...</p>
      ) : filteredData.length === 0 ? (
        <p className="text-[#6b7280] text-center">No products found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((brand, index) => (
            <Link
              key={index}
              to={`/brands/${brand._id}`}
              className="cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <BrandCard
                packImage={brand.packImage}
                productType={brand.productType || "N/A"}
                name={brand.name || "Unnamed"}
                generic={brand.generic?.name || "N/A"}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DrugClasses;
