import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BrandCard from "../../components/Drugs/BrandCard";
import { GetAllBrands } from "../../lib/APIs/brandsAPI";
import { toast } from "react-toastify";
import { MdOutlineMedicalServices } from "react-icons/md";
import { IoSearch } from "react-icons/io5";

const BioequivalentDrugs = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-10 font-inter">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b-2 border-[#34d399] pb-5 mb-10">
        <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
          <MdOutlineMedicalServices className="text-[#34d399] text-3xl" />
          <span className="tracking-wide">Bioequivalent Drugs</span>
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

      {/* MAIN CONTENT */}
      {loading ? (
        <p className="text-[#6b7280] text-center">
          Loading Bioequivalent Drugs...
        </p>
      ) : brands.length === 0 ? (
        <p className="text-[#6b7280] text-center">
          No Bioequivalent Drugs found.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands
            ?.filter((item) => item.bioequivalentDrug === "yes")
            .map((brand, index) => (
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

export default BioequivalentDrugs;
