import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import CarouselMeds from "../../components/Home/CarouselMeds";
import { Heading } from "../../components/Heading/Heading";
import { GetGenerics } from "../../lib/APIs/genericAPI";
import Brands from "../../components/Home/Brands/Brands";
import Test from "../../components/Home/Test/Test";
import News from "../../components/Home/News/News";

const Home = () => {
  const [generics, setGenerics] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchGenerics = async () => {
    try {
      setLoading(true);
      const response = await GetGenerics();
      setGenerics(response?.data || []);
    } catch (error) {
      toast.error("Error fetching generics");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenerics();
  }, []);

  const filteredGenerics = generics.filter((generic) =>
    generic.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full min-h-[30rem] border-y-4 border-tertiary flex flex-col items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: "url(/cover.jpg)" }}
        ></div>
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Search Section */}
        <div className="relative z-10 flex flex-col items-center w-full ">
          {/* <motion.h1
            className="text-xl md:text-4xl font-bold text-white text-center mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            Search by Generic
          </motion.h1> */}

          <motion.div
            className="relative flex items-center justify-center w-full"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          >
            <input
              type="text"
              placeholder="Seach by Brand or Generic Name e.g Pcab or Vonoprazan"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(e.target.value.trim() !== "");
              }}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // closes dropdown when clicked outside
              onFocus={() => searchQuery && setShowDropdown(true)}
              className="w-full max-w-xl focus:outline-none font-semibold placeholder:font-semibold placeholder:text-gray-500 bg-white text-black px-3 py-3 md:py-4 rounded-l-md"
            />
            <p className="text-white bg-[#34d399] hover:bg-secondary cursor-pointer transition-all duration-300 px-4 md:px-8 py-3 md:py-4 font-semibold rounded-r-md">
              Search
            </p>

            <div className="flex items-center justify-center">
              {/* Dropdown */}
              {showDropdown && filteredGenerics.length > 0 && (
                <ul className="absolute top-full w-full max-w-lg bg-white shadow-lg border rounded-md mt-1 max-h-56 overflow-y-auto z-50">
                  {filteredGenerics.map((item) => (
                    <li key={item._id}>
                      <Link
                        to={`/generics/${item._id}`}
                        className="block px-4 py-2 hover:bg-gray-100 text-gray-700 font-medium w-full max-w-lg"
                        onClick={() => {
                          setShowDropdown(false);
                          setSearchQuery("");
                        }}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {/* No results */}
              {showDropdown && filteredGenerics.length === 0 && (
                <div className="absolute top-full w-full max-w-lg bg-white border rounded-md mt-1 shadow-lg z-50 p-3 text-gray-500">
                  No results found
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Other Sections */}
      <CarouselMeds />

      <Heading
        heading="Featured News"
        text="Stay updated with the latest insights, trending stories, and expert articles curated just for you."
      />
      <News />

      <Heading
        heading="Brands"
        text="Explore trusted medical and pharmaceutical brands recommended by professionals."
      />
      <Brands />

      <Heading
        heading="Medical Test"
        text="Find complete details of available medical tests, procedures, and reports."
      />
      <Test />
    </div>
  );
};

export default Home;
