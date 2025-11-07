import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { GetAllBrands , DeleteBrand } from "../../../lib/APIs/brandsAPI";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoEyeSharp } from "react-icons/io5";
import { toast } from "react-toastify";

const AllBrands = () => {
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModel, setDeleteModel] = useState(false);
  const [deleteBrandLoading, setdeleteBrandLoading] = useState(false);
  const [deleteBrandsId, setdeleteBrandsId] = useState("");

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await GetAllBrands();
      setBrands(response.data.reverse());
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);
  
    const handleDelete = (id) => {
      setDeleteModel(true);
      setdeleteBrandsId(id);
    };
  
    const deleteBrands = async () => {
      try {
        if (!deleteBrandsId) return;
        setdeleteBrandLoading(true);
        const response = await DeleteBrand(deleteBrandsId);
        fetchBrands();
        toast.success(response.message);
        setDeleteModel(false);
        setdeleteBrandsId("");
      } catch (error) {
        toast.error(error.response?.data?.message);
      } finally {
        setdeleteBrandLoading(false);
      }
    };
  
    // ✅ Filter news by title
    const filteredBrands = brands.filter((brand) =>
      brand.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  

  return (
    <>
    <div className="w-full max-w-[84vw] mx-auto p-4">
      {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Search brands by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-3 w-full max-w-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          />
        <Link
          to="/admin/brand-create"
          className="bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-5 rounded-md shadow-sm transition-all"
        >
          Create Brand
        </Link>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-10 text-gray-600 text-lg">Loading...</div>
      ) : filteredBrands.length > 0 ? (
        <>
          {/* Table for Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-green-50">
                <tr>
                  {["#", "Name", "Product Type", "Strength", "Pack Image", "Actions"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200"
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBrands.map((brand, index) => (
                  <tr key={brand._id || index} className="hover:bg-green-50 transition-colors">
                    <td className="px-4 py-2 text-gray-700 text-sm">{index + 1}</td>
                    <td className="px-4 py-2 text-gray-700 text-sm">{brand.name}</td>
                    <td className="px-4 py-2 text-gray-700 text-sm">{brand.productType}</td>
                    <td className="px-4 py-2 text-gray-700 text-sm">
                      {brand.strength || "—"}
                    </td>
                    <td className="px-4 py-2">
                      {brand.packImage ? (
                        <img
                          src={brand.packImage}
                          alt={brand.name}
                          className="w-14 h-14 object-cover rounded-md border border-gray-300"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">No image</span>
                      )}
                    </td>
                    <td className="px-4 py-2 flex items-center gap-3">
                      <MdDelete
                        size={20}
                        className="text-green-600 hover:text-green-700 cursor-pointer transition-colors"
                        onClick={() => handleDelete(brand._id)}
                      />
                      <Link to={`/admin/brand-update/${brand._id}`}>
                        <MdEdit
                          size={20}
                          className="text-green-600 hover:text-green-700 cursor-pointer transition-colors"
                        />
                      </Link>
                      <Link to={`/admin/brand/${brand._id}`}>
                        <IoEyeSharp
                          size={20}
                          className="text-green-600 hover:text-green-700 cursor-pointer transition-colors"
                        />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards for Mobile */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredBrands.map((brand, index) => (
              <div
                key={brand._id || index}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-green-700 font-semibold text-lg">{brand.name}</h3>
                  <span className="text-gray-500 text-sm">#{index + 1}</span>
                </div>
                {brand.packImage && (
                  <img
                    src={brand.packImage}
                    alt={brand.name}
                    className="w-full h-36 object-cover rounded-md border mb-3"
                  />
                )}
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Type:</strong> {brand.productType}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Strength:</strong> {brand.strength || "—"}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  <strong>Price:</strong>{" "}
                  {brand.unitPrice ? `৳${brand.unitPrice}` : "—"}
                </p>
                <div className="flex justify-end gap-3">
                  <MdDelete
                    size={20}
                    className="text-green-600 hover:text-green-700 cursor-pointer transition-colors"
                    onClick={() => handleDelete(brand._id)}
                 />
                  <Link to={`/admin/brand-update/${brand._id}`}>
                    <MdEdit
                      size={20}
                      className="text-green-600 hover:text-green-700 cursor-pointer transition-colors"
                    />
                  </Link>
                  <Link to={`/admin/brand/${brand._id}`}>
                    <IoEyeSharp
                      size={20}
                      className="text-green-600 hover:text-green-700 cursor-pointer transition-colors"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-10 text-gray-600 text-lg">
          No brands available 🏷️
        </div>
      )}
    </div>
          {/* Delete Modal */}
      {deleteModel && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg">
            <p className="text-gray-700 text-base text-center mb-8">
              Are you sure you want to delete this brand?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteModel(false)}
                className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-md px-4 py-2 text-sm transition-all"
              >
                Cancel
              </button>
              <button
                disabled={deleteBrandLoading}
                onClick={deleteBrands}
                className="bg-green-600 text-white hover:bg-green-700 rounded-md px-4 py-2 text-sm transition-all disabled:opacity-70"
              >
                {deleteBrandLoading ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
      </>
  );
};

export default AllBrands;
