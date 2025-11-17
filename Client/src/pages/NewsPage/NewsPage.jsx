import React, { useEffect, useState } from "react";
import "./NewsPage.css";
import NewsCard from "../../components/News/NewsCard";
import { GetAllNews } from "../../lib/APIs/newsAPI.js";
import { toast } from "react-toastify";
import { MdOutlineMedicalServices } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import Pagination from "../../components/Layout/Pagination.jsx"; // ✅ Adjust the import path if needed

const NewsPage = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await GetAllNews();
        setNewsList(response.data || []);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // ✅ Filter news by search query
  const filteredNews = newsList.filter((news) =>
    news.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredNews.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-10 font-inter">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 border-b-2 border-green-200 pb-4">
        <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
          <MdOutlineMedicalServices className="text-[#34d399] text-3xl" />
          <span className="tracking-wide">News</span>
        </h2>

        {/* Search Box */}
        <div className="relative w-full md:w-72">
          <IoSearch className="absolute top-2.5 left-3 text-[#34d399] text-lg" />
          <input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-green-300 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-[#34d399] focus:outline-none transition-all bg-white"
          />
        </div>
      </div>

      {/* News Cards */}
      <div className="news-page">
        {loading ? (
          <p className="text-center text-gray-600 text-lg">Loading news...</p>
        ) : currentItems.length > 0 ? (
          currentItems.map((news) => (
            <NewsCard
              key={news._id}
              title={news.title}
              description={news.description}
              image={news.image}
              publishDate={news.publishDate}
              unpublishDate={news.unpublishDate}
              isActive={news.isActive}
            />
          ))
        ) : (
          <p className="text-center text-gray-600 text-lg">
            No news available at the moment.
          </p>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-10">
        <Pagination
          currentPage={currentPage}
          totalItems={filteredNews.length}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default NewsPage;
