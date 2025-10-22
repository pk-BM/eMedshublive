import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BrandCard from "../../components/Drugs/BrandCard";
import { GetAllBrands } from "../../lib/APIs/brandsAPI";
import { toast } from "react-toastify";

const DrugClasses = () => {
  const [selectedClass, setSelectedClass] = useState("All Products");
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const drugCategories = [
    "All Products",
    "New Products",
    "Bioequivalent Products",
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
        item.productType?.toLowerCase().includes("bio equivalent" || "bioequivalent")
      );
    } else if (selectedClass === "New Products") {
      filtered = [...brands]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);
    }

    // ✅ Search filter
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
    <div className="p-8 max-w-6xl mx-auto">
      {/* Category Buttons and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div className="flex flex-wrap gap-3">
          {drugCategories.map((drugClass) => (
            <button
              key={drugClass}
              onClick={() => setSelectedClass(drugClass)}
              className={`px-4 py-2 border rounded-md text-sm font-medium transition-all ${
                selectedClass === drugClass
                  ? "bg-teal-600 text-white"
                  : "border-teal-600 text-teal-700 hover:bg-teal-50"
              }`}
            >
              {drugClass}
            </button>
          ))}
        </div>

        {/* ✅ Search bar */}
        <input
          type="text"
          placeholder="Search brand or generic..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Section Title */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-teal-600 pl-3">
        {selectedClass}
      </h2>

      {/* Loading / Empty / Data */}
      {loading ? (
        <p className="text-gray-500">Loading brands...</p>
      ) : filteredData.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid gap-4">
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
