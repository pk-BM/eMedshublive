import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaNewspaper, FaBookOpen } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { GetAllNews } from "../../../lib/APIs/newsAPI";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await GetAllNews();
        const fetched = response?.data || [];

        // Sort latest first
        const sortedNews = fetched.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Map required fields
        const formattedNews = sortedNews.map((item) => ({
          _id: item._id,
          title: item.title || "Untitled News",
          date: new Date(item.createdAt).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
          }),
        }));

        // Fill remaining slots with placeholders
        const filledNews = [
          ...formattedNews,
          ...Array(Math.max(0, 10 - formattedNews.length)).fill({
            title: "Coming Soon...",
            date: "--",
            _id: null,
          }),
        ].slice(0, 10);

        setNewsList(filledNews);
      } catch (error) {
        console.error("Error fetching news:", error);
        toast.error("Failed to fetch news.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Split into two sections
  const featuredNews = newsList.slice(0, 5);
  const featuredArticles = newsList.slice(5, 10);

  return (
    <div className="flex flex-col md:flex-row justify-center gap-8 px-6 md:px-28">
      {/* Featured News Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-lg shadow-md overflow-hidden w-full md:w-1/2"
      >
        <div className="bg-[#34d399] text-center text-white p-6">
          <FaNewspaper className="text-4xl mx-auto mb-3" />
          <h3 className="text-lg font-semibold tracking-wide">FEATURED NEWS</h3>
        </div>

        <ul className="p-4 space-y-3">
          {featuredNews.map((item, i) => {
            const isPlaceholder = item.title === "Coming Soon...";
            return (
              <li
                key={i}
                className={`flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-3 rounded-lg transition ${
                  isPlaceholder ? "opacity-60 cursor-default" : "cursor-pointer"
                }`}
              >
                {isPlaceholder ? (
                  // Placeholder (non-clickable)
                  <div className="flex items-center gap-3 w-full">
                    <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-md text-sm font-semibold">
                      {item.date}
                    </span>
                    <span className="text-gray-800 font-medium">
                      {item.title}
                    </span>
                  </div>
                ) : (
                  // Clickable news
                  <Link
                    to="/news"
                    className="flex justify-between items-center w-full"
                  >
                    <div className="flex items-center gap-3">
                      <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-md text-sm font-semibold">
                        {item.date}
                      </span>
                      <span className="text-gray-800 font-medium">
                        {item.title}
                      </span>
                    </div>
                    <FiArrowRight className="text-pink-500 text-lg" />
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </motion.div>

      {/* Featured Articles Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white rounded-lg shadow-md overflow-hidden w-full md:w-1/2"
      >
        <div className="bg-[#34d399] text-center text-white p-6">
          <FaBookOpen className="text-4xl mx-auto mb-3" />
          <h3 className="text-lg font-semibold tracking-wide">FEATURED NEWS</h3>
        </div>

        <ul className="p-4 space-y-3">
          {featuredArticles.map((item, i) => {
            const isPlaceholder = item.title === "Coming Soon...";
            return (
              <li
                key={i}
                className={`flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-3 rounded-lg transition ${
                  isPlaceholder ? "opacity-60 cursor-default" : "cursor-pointer"
                }`}
              >
                {isPlaceholder ? (
                  <div className="flex items-center gap-3 w-full">
                    <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-md text-sm font-semibold">
                      {item.date}
                    </span>
                    <span className="text-gray-800 font-medium">
                      {item.title}
                    </span>
                  </div>
                ) : (
                  <Link
                    to="/news"
                    className="flex justify-between items-center w-full"
                  >
                    <div className="flex items-center gap-3">
                      <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-md text-sm font-semibold">
                        {item.date}
                      </span>
                      <span className="text-gray-800 font-medium">
                        {item.title}
                      </span>
                    </div>
                    <FiArrowRight className="text-pink-500 text-lg" />
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </motion.div>
    </div>
  );
};

export default News;
