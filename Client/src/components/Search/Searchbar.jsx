import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { GetSearchResults } from "../../lib/APIs/searchAPI";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const navigate = useNavigate();
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Handle search API call
  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);
      const data = await GetSearchResults(query);
      if (data.success) {
        setResults(data.data || []);
        setShowDropdown(true);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        handleSearch(searchQuery);
      } else {
        setResults([]);
        setShowDropdown(false);
        setHasSearched(false);
      }
    }, 350);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, handleSearch]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (apiPath) => {
    navigate(apiPath);
    setResults([]);
    setSearchQuery("");
    setShowDropdown(false);
    setSelectedIndex(-1);
    setHasSearched(false);
  };

  const handleKeyDown = (e) => {
    // Escape key to close dropdown
    if (e.key === "Escape") {
      setShowDropdown(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
      return;
    }

    if (!results.length) {
      if (e.key === "Enter" && searchQuery.trim()) {
        handleSearch(searchQuery);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleResultClick(results[selectedIndex].apiPath);
      }
    }
  };

  const handleInputFocus = () => {
    if (results.length > 0 || hasSearched) {
      setShowDropdown(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative z-[1000] flex flex-col items-center w-full px-6 md:px-28"
    >
      <motion.div
        className="relative flex items-center justify-center w-full mb-2"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Search by Brand or Generic Name eg; Progut or Esomeprazole"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          className="w-full focus:outline-none focus:ring-2 focus:ring-[#34d399] font-semibold placeholder:font-semibold placeholder:text-gray-500 bg-white text-black px-4 py-3 md:py-4 rounded-l-md border border-gray-300 text-sm transition-all duration-200"
        />
        <button
          onClick={() => handleSearch(searchQuery)}
          disabled={loading || !searchQuery.trim()}
          className="text-white bg-[#34d399] hover:bg-green-600 cursor-pointer transition-all duration-300 min-w-28 py-3 md:py-4 font-semibold rounded-r-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="hidden sm:inline">Searching...</span>
            </>
          ) : (
            "Search"
          )}
        </button>
      </motion.div>

      {/* Search Results Dropdown */}
      {showDropdown && (
        <div className="absolute top-full mt-2 left-6 right-6 md:left-28 md:right-28 bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden max-h-80 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-6 gap-2">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-[#34d399] rounded-full animate-spin"></div>
              <span className="text-gray-500">Searching...</span>
            </div>
          ) : results.length > 0 ? (
            results.map((item, index) => (
              <div
                key={item._id}
                onClick={() => handleResultClick(item.apiPath)}
                className={`group flex justify-between items-center px-4 py-3 cursor-pointer transition-all duration-200 ${
                  selectedIndex === index
                    ? "bg-tertiary text-white"
                    : "hover:bg-tertiary hover:text-white"
                }`}
              >
                <div>
                  <p
                    className={`font-semibold ${
                      selectedIndex === index ? "text-white" : "text-gray-800 group-hover:text-white"
                    }`}
                  >
                    {item.name}
                  </p>
                  <p
                    className={`text-sm ${
                      selectedIndex === index ? "text-gray-100" : "text-gray-500 group-hover:text-white"
                    }`}
                  >
                    {item.type}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded transition-all duration-200 ${
                    selectedIndex === index
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-600 group-hover:bg-white/20 group-hover:text-white"
                  }`}
                >
                  View
                </span>
              </div>
            ))
          ) : hasSearched ? (
            <div className="px-4 py-6 text-center">
              <p className="text-gray-500">No results found for "{searchQuery}"</p>
              <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
