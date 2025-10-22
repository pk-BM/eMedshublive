import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { GetGenerics , DeleteGeneric} from "../../../lib/APIs/genericAPI";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoEyeSharp } from "react-icons/io5";
import { toast } from "react-toastify";

const AllGenerics = () => {
  const [loading, setLoading] = useState(false);
  const [generics, setGenerics] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModel, setDeleteModel] = useState(false);
  const [deleteGenericLoading, setdeleteGenericLoading] = useState(false);
  const [deleteGenericId, setdeleteGenericId] = useState("");

  const fetchGenerics = async () => {
    try {
      setLoading(true);
      const response = await GetGenerics();
      setGenerics(response.data);
    } catch (error) {
      console.error("Error fetching generics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenerics();
  }, []);
   
      const handleDelete = (id) => {
        setDeleteModel(true);
        setdeleteGenericId(id);
      };
    
      const deleteGenerics = async () => {
        try {
          if (!deleteGenericId) return;
          setdeleteGenericLoading(true);
          const response = await DeleteGeneric(deleteGenericId);//Component API
          fetchGenerics();//Fetch component name
          toast.success(response.message);
          setDeleteModel(false);
          setdeleteGenericId("");
        } catch (error) {
          toast.error(error.response?.data?.message);
        } finally {
          setdeleteGenericLoading(false);
        }
      };
    
      // ✅ Filter news by title
      const filteredGenerics = generics.filter((generic) =>
        generic.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    

  return (
     <>
    <div className="w-full max-w-[84vw] mx-auto p-4">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Search generics by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-3 w-full max-w-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          />
        <Link
          to="/admin/generic-create"
          className="bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-5 rounded-md shadow-sm transition-all"
        >
          Create Generic
        </Link>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-10 text-gray-600 text-lg">
          Loading...
        </div>
      ) : filteredGenerics.length > 0 ? (
        <>
          {/* Table for Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-green-50">
                <tr>
                  {[
                    "#",
                    "Name",
                    "Therapeutic Class",
                    // "Indication",
                    "Active",
                    "Structure",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredGenerics.map((item, index) => (
                  <tr
                    key={item._id || index}
                    className="hover:bg-green-50 transition-colors"
                  >
                    <td className="px-4 py-2 text-gray-700 text-sm">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 text-gray-700 text-sm">
                      {item.name || "—"}
                    </td>
                    <td className="px-4 py-2 text-gray-700 text-sm">
                      {item.therapeuticClass || "—"}
                    </td>
                    {/* <td className="px-4 py-2 text-gray-700 text-sm line-clamp-1">
                      {item.indication || "—"}
                    </td> */}
                    <td className="px-4 py-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-4 py-2">
                      {item.structureImage ? (
                        <img
                          src={item.structureImage}
                          alt={item.name}
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
                      onClick={() => handleDelete(item._id)}
                      />
                      <Link to={`/admin/generic-update/${item._id}`}>
                        <MdEdit
                          size={20}
                          className="text-green-600 hover:text-green-700 cursor-pointer transition-colors"
                        />
                      </Link>
                      <Link to={`/admin/generic/${item._id}`}>
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
            {filteredGenerics.map((item, index) => (
              <div
                key={item._id || index}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-green-700 font-semibold text-lg">
                    {item.name || "Untitled"}
                  </h3>
                  <span className="text-gray-500 text-sm">#{index + 1}</span>
                </div>

                {item.structureImage && (
                  <img
                    src={item.structureImage}
                    alt={item.name}
                    className="w-full h-36 object-cover rounded-md border mb-3"
                  />
                )}

                <p className="text-sm text-gray-600 mb-1">
                  <strong>Therapeutic Class:</strong>{" "}
                  {item.therapeuticClass || "—"}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Indication:</strong> {item.indication || "—"}
                </p>
                <p className="text-sm mb-3">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.isActive ? "Active" : "Inactive"}
                  </span>
                </p>

                <div className="flex justify-end gap-3">
                  <MdDelete
                    size={20}
                    className="text-green-600 hover:text-green-700 cursor-pointer transition-colors"
                  />
                  <Link to={`/admin/generic-update/${item._id}`}>
                    <MdEdit
                      size={20}
                      className="text-green-600 hover:text-green-700 cursor-pointer transition-colors"
                    />
                  </Link>
                  <Link to={`/admin/generic/${item._id}`}>
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
          No generics available ⚕️
        </div>
      )}
    </div>
     {deleteModel && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg">
            <p className="text-gray-700 text-base text-center mb-8">
              Are you sure you want to delete this generic?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteModel(false)}
                className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-md px-4 py-2 text-sm transition-all"
              >
                Cancel
              </button>
              <button
                disabled={deleteGenericLoading}
                onClick={deleteGenerics}
                className="bg-green-600 text-white hover:bg-green-700 rounded-md px-4 py-2 text-sm transition-all disabled:opacity-70"
              >
                {deleteGenericLoading ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
     </>
  );
};

export default AllGenerics;
