import React, { useEffect, useState } from "react";

const BrandList = () => {
  const [brands, setBrands] = useState([]);

  // Fetch data from backend
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(""); // your backend API endpoint
        const data = await response.json();
        setBrands(data);
      } catch (error) {
        console.error("Error fetching brand data:", error);
      }
    };
    fetchBrands();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Available Brand Names</h2>
        <button className="border border-green-600 text-green-700 px-4 py-1 rounded hover:bg-green-50">
          View All
        </button>
      </div>

      <div className="mb-4">
        <select className="border p-2 rounded w-full md:w-1/3">
          <option>FILTER BY COMPANY</option>
          {/* you can dynamically populate company options if needed */}
        </select>
      </div>

      <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
        {brands.map((brand, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-64 bg-white border rounded-lg shadow-sm p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">💉</span>
              <h3 className="text-lg font-semibold">{brand.name}</h3>
            </div>
            <p className="text-gray-600">{brand.strength}</p>
            <p className="text-gray-500 mb-2">{brand.company}</p>
            <p className="text-green-600 font-medium">
              {brand.priceLabel} : ৳ {brand.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandList;
