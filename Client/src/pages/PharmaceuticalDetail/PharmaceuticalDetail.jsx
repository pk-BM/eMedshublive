import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { GetAllPharmaceutical } from "../../lib/APIs/pharmaceuticalAPI";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  FaIndustry,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaLink,
  FaCapsules,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { MdOutlineMedicalServices } from "react-icons/md";

const PharmaceuticalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pharmaceutical, setPharmaceutical] = useState(null);

  const fetchPharmaceuticals = async () => {
    try {
      setLoading(true);
      const response = await GetAllPharmaceutical();
      const data = response.data || [];
      const selected = data.find((item) => item._id === id);
      setPharmaceutical(selected);
    } catch (error) {
      console.error("Error fetching pharmaceuticals:", error);
      toast.error("Failed to fetch pharmaceutical details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmaceuticals();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-[#6b7280] text-lg">
        Loading Pharmaceutical details...
      </div>
    );
  }

  if (!pharmaceutical) {
    return (
      <div className="flex justify-center items-center min-h-screen text-[#ec4899] text-lg">
        Pharmaceutical not found or unavailable.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] px-6 py-12 font-inter">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto flex flex-col items-center gap-4 mb-12"
      >
        <div className="flex items-center gap-3">
          <MdOutlineMedicalServices className="text-4xl text-[#34d399]" />
          <h1 className="text-3xl md:text-4xl font-bold text-[#1f2937] tracking-wide">
            {pharmaceutical.name}
          </h1>
        </div>
        {/* <div className="flex items-center gap-2">
          {pharmaceutical.isActive ? (
            <span className="flex items-center gap-1 text-[#34d399] font-medium">
              <FaCheckCircle /> Active
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[#ec4899] font-medium">
              <FaTimesCircle /> Inactive
            </span>
          )}
        </div> */}
      </motion.div>

      {/* Main Card */}
      <motion.div
        className="max-w-5xl mx-auto bg-[#ffffff] shadow-lg rounded-3xl p-10 border border-[#e5e7eb]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <motion.img
            src={
              pharmaceutical.logo && pharmaceutical.logo.trim() !== ""
                ? pharmaceutical.logo
                : "/no-image.png"
            }
            alt={pharmaceutical.name}
            className="w-48 h-48 object-contain rounded-2xl shadow-sm border border-[#e5e7eb] bg-[#f9fafb]"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          />
        </div>

        {/* Info Section */}
        <div className="space-y-6 text-[#1f2937] leading-relaxed">
          <InfoRow
            icon={<FaIndustry className="text-[#34d399] text-xl" />}
            label="Company Name"
            value={pharmaceutical.name}
          />
          <InfoRow
            icon={<FaCapsules className="text-[#34d399] text-xl" />}
            label="Total Generics"
            value={pharmaceutical.totalGenerics ?? "N/A"}
          />
          <InfoRow
            icon={<FaPhoneAlt className="text-[#34d399] text-xl" />}
            label="Contact"
            value={pharmaceutical.contactDetails || "N/A"}
          />
          <InfoRow
            icon={<FaMapMarkerAlt className="text-[#34d399] text-xl" />}
            label="Address"
            value={pharmaceutical.address || "N/A"}
          />
          <InfoRow
            icon={<FaLink className="text-[#34d399] text-xl" />}
            label="Map Link"
            value={
              pharmaceutical.mapLink ? (
                <a
                  href={pharmaceutical.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#34d399] underline hover:text-[#1f2937]"
                >
                  View on Map
                </a>
              ) : (
                "N/A"
              )
            }
          />
        </div>

        {/* Back Button */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-[#34d399] hover:bg-[#2eb47a] text-[#ffffff] text-lg py-2.5 px-8 rounded-xl shadow-md transition-all"
          >
            Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-3 border-b border-[#f3f4f6] pb-4">
    <div className="flex items-center gap-2 min-w-[170px]">
      {icon}
      <span className="font-semibold text-[#1f2937]">{label}:</span>
    </div>
    <div className="text-[#6b7280]">{value}</div>
  </div>
);

export default PharmaceuticalDetail;
