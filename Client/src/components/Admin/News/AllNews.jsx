import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { DeleteNews, GetAllNews } from "../../../lib/APIs/newsAPI";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoEyeSharp } from "react-icons/io5";
import { toast } from "react-toastify";

const AllNews = () => {
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ new state for search
  const [deleteModel, setDeleteModel] = useState(false);
  const [deleteNewsLoading, setDeleteNewsLoading] = useState(false);
  const [deleteNewsId, setDeleteNewsId] = useState("");

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await GetAllNews();
      setNews(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = (id) => {
    setDeleteModel(true);
    setDeleteNewsId(id);
  };

  const deleteNews = async () => {
    try {
      if (!deleteNewsId) return;
      setDeleteNewsLoading(true);
      const response = await DeleteNews(deleteNewsId);
      fetchNews();
      toast.success(response.message);
      setDeleteModel(false);
      setDeleteNewsId("");
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setDeleteNewsLoading(false);
    }
  };

  // ✅ Filter news by title
  const filteredNews = news.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="w-full max-w-[84vw] mx-auto p-4">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Search news by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-3 w-full max-w-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          />
          <Link
            to="/admin/news/create"
            className="bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-5 rounded-md shadow-sm transition-all"
          >
            Create News
          </Link>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-10 text-gray-600 text-lg">
            Loading...
          </div>
        ) : filteredNews.length > 0 ? ( // ✅ use filteredNews here
          <>
            {/* Table for Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-green-50">
                  <tr>
                    {["#", "Title", "Publish Date", "Unpublish Date", "Image", "Actions"].map((heading) => (
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
                  {filteredNews.map((item, index) => (
                    <tr key={item._id || index} className="hover:bg-green-50 transition-colors">
                      <td className="px-4 py-2 text-gray-700 text-sm">{index + 1}</td>
                      <td className="px-4 py-2 text-gray-700 text-sm">{item.title}</td>
                      <td className="px-4 py-2 text-gray-700 text-sm">
                        {item.publishDate ? new Date(item.publishDate).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-2 text-gray-700 text-sm">
                        {item.unpublishDate ? new Date(item.unpublishDate).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-2">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
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
                        <Link to={`/admin/news/update/${item._id}`}>
                          <MdEdit
                            size={20}
                            className="text-green-600 hover:text-green-700 cursor-pointer transition-colors"
                          />
                        </Link>
                        <Link to={`/news/${item._id}`}>
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
              {filteredNews.map((item, index) => (
                <div
                  key={item._id || index}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-green-700 font-semibold text-lg">{item.title}</h3>
                    <span className="text-gray-500 text-sm">#{index + 1}</span>
                  </div>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-36 object-cover rounded-md border mb-3"
                    />
                  )}
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Publish:</strong>{" "}
                    {item.publishDate ? new Date(item.publishDate).toLocaleDateString() : "—"}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    <strong>Unpublish:</strong>{" "}
                    {item.unpublishDate ? new Date(item.unpublishDate).toLocaleDateString() : "—"}
                  </p>
                  <div className="flex justify-end gap-3">
                    <MdDelete
                      size={20}
                      className="text-green-600 hover:text-green-700 cursor-pointer transition-colors"
                      onClick={() => handleDelete(item._id)}
                    />
                    <Link to={`/admin/news/update/${item._id}`}>
                      <MdEdit size={20} className="text-green-600 hover:text-green-700 cursor-pointer" />
                    </Link>
                    <Link to={`/news/${item._id}`}>
                      <IoEyeSharp size={20} className="text-green-600 hover:text-green-700 cursor-pointer" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-10 text-gray-600 text-lg">
            No news found matching your search 📰
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModel && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg">
            <p className="text-gray-700 text-base text-center mb-8">
              Are you sure you want to delete this news?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteModel(false)}
                className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-md px-4 py-2 text-sm transition-all"
              >
                Cancel
              </button>
              <button
                disabled={deleteNewsLoading}
                onClick={deleteNews}
                className="bg-green-600 text-white hover:bg-green-700 rounded-md px-4 py-2 text-sm transition-all disabled:opacity-70"
              >
                {deleteNewsLoading ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default AllNews;
