import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { GetSearchResults } from "../../lib/APIs/searchAPI";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        handleSearch(searchQuery);
      } else {
        setResults([]);
      }
    }, 50);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSearch = useCallback(async (query) => {
    try {
      setLoading(true);
      const data = await GetSearchResults(query);
      if (data.success) setResults(data.data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleResultClick = (apiPath) => {
    navigate(apiPath);
    setResults([]);
    setSearchQuery("");
  };

  const handleKeyDown = (e) => {
    if (!results.length) return;

    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleResultClick(results[selectedIndex].apiPath);
      } else if (searchQuery.trim()) {
        handleSearch(searchQuery);
      }
    }
  };

  return (
    <div className="relative z-[1000] flex flex-col items-center w-full px-6 md:px-28">
      <motion.div
        className="relative flex items-center justify-center w-full mb-2"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
      >
        <input
          type="text"
          placeholder="Search by Brand or Generic Name eg; Progut or Esomeprazole"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          className="w-full focus:outline-none font-semibold placeholder:font-semibold placeholder:text-gray-500 bg-white text-black px-3 py-3 md:py-4 rounded-l-md border border-gray-300 text-sm"
        />
        <button
          onClick={() => handleSearch(searchQuery)}
          className="text-white bg-[#34d399] hover:bg-green-600 cursor-pointer transition-all duration-300 min-w-28 py-3 md:py-4 font-semibold rounded-r-md"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </motion.div>

      {/*Search Results Dropdown */}
      {results.length > 0 && (
        <div className="absolute top-full mt-2 w-full px-6 md:px-28 bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden">
          {results.map((item, index) => (
            <div
              key={item._id}
              onClick={() => handleResultClick(item.apiPath)}
              className={`group flex justify-between items-center px-4 py-3 cursor-pointer transition ${
                selectedIndex === index ? "bg-tertiary" : "hover:bg-tertiary"
              }`}
            >
              <div>
                <p className="font-semibold text-gray-800 group-hover:text-white">
                  {item.name}
                </p>
                <p className="text-sm text-gray-500 group-hover:text-white">
                  {item.type}
                </p>
              </div>
              <span className="text-xs bg-gray-200 text-gray-600  px-2 py-1 rounded">
                View
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
