import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaNewspaper, FaBookOpen } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { GetAllNews } from "../../../lib/APIs/newsAPI";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function LatestLeaders() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/leaders");
        const fetched = response?.data || [];

        const sortedLeaders = fetched.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        const latestFive = sortedLeaders.slice(0, 5);

        setLeaders(latestFive);
      } catch (error) {
        console.error("Error fetching leaders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-10">
        <p className="text-gray-500">Loading leaders...</p>
      </div>
    );

  return (
    <div className="py-12 bg-white text-center">
      <h2 className="text-2xl font-bold mb-6">Our Leaders</h2>

      <div className="flex flex-wrap justify-center gap-8">
        {leaders.map((leader) => (
          <div
            key={leader._id}
            className="w-48 flex flex-col items-center transition-transform hover:scale-105"
          >
            <img
              src={leader.profilePicture}
              alt={leader.name}
              className="w-40 h-40 object-cover rounded-full shadow-md mb-3"
            />
            <h3 className="text-lg font-semibold">{leader.name}</h3>
          </div>
        ))}
      </div>

      <button className="mt-8 px-6 py-2 bg-indigo-700 text-white rounded-full hover:bg-indigo-800 transition">
        View More
      </button>
    </div>
  );
}
