import React, { useEffect, useState } from "react";
import { GetLeaderById } from "../../lib/APIs/leaderAPI";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { MdOutlineMedicalServices } from "react-icons/md";
import { motion } from "framer-motion";

const LeaderDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [leader, setLeader] = useState(null);

  const fetchLeader = async () => {
    try {
      setLoading(true);
      const response = await GetLeaderById(id);
      setLeader(response.data);
    } catch (error) {
      console.error("Error fetching Leader:", error);
      toast.error("Failed to fetch Leader details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchLeader();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-lg">
        Loading Leader details...
      </div>
    );
  }

  if (!leader) {
    return (
      <div className="flex justify-center items-center min-h-screen text-pink-500 text-lg">
        Leader not found or unavailable.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-[#ecfdf5] from-b via-white to-[#f9fafb] px-6 py-12 font-inter">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto flex flex-col items-center gap-3 mb-12 text-center"
      >
        <div className="flex items-center justify-center gap-3">
          <MdOutlineMedicalServices className="text-5xl text-[#10b981]" />
          <h1 className="text-3xl md:text-4xl font-bold text-[#1f2937] tracking-wide">
            Leader Profile
          </h1>
        </div>
        <p className="text-gray-600 max-w-2xl">
          Meet our distinguished leader and learn about their journey, experience, and contributions.
        </p>
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left: Image Section */}
        <div className="md:w-1/3 flex justify-center items-center p-6">
          <motion.img
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            src={leader.profilePicture || "/default-profile.png"}
            alt={leader.name}
            className="rounded-xl w-full h-auto object-cover shadow-md"
          />
        </div>

        {/* Right: Info Section */}
        <div className="md:w-2/3 p-8 flex flex-col justify-center">
          {leader.department && (
            <p className="text-sm font-medium text-[#10b981] uppercase tracking-wide">
              {leader.department}
            </p>
          )}
          <h2 className="text-3xl font-bold text-[#111827] mt-2">{leader.name}</h2>
          <p className="text-gray-600 mt-1 text-lg font-medium">
            {leader.designation}
          </p>

          <div className="mt-4 space-y-2 text-gray-700">
            {leader.previous && (
              <p>
                <span className="font-semibold text-gray-900">Previous:</span>{" "}
                {leader.previous}
              </p>
            )}
            {leader.institution && (
              <p>
                <span className="font-semibold text-gray-900">Institution:</span>{" "}
                {leader.institution}
              </p>
            )}
          </div>

          {/* <div className="mt-6">
            <button className="px-6 py-2 bg-[#10b981] hover:bg-[#059669] transition text-white rounded-full font-medium shadow-md">
              Connect
            </button>
          </div> */}
        </div>
      </motion.div>

      {/* Biography Section */}
      {leader.bio && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg"
        >
          <h3 className="text-2xl font-semibold mb-3 flex items-center gap-2 text-[#111827]">
            Biography
          </h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {leader.bio}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default LeaderDetails;
