import React, { useEffect, useState } from "react";
import { Analytics } from "../../../lib/APIs/authAPI";
import { motion } from "framer-motion";
import {
  MdCampaign,
  MdLocalPharmacy,
  MdHealthAndSafety,
  MdGroups,
  MdScience,
  MdNewspaper,
  MdWorkspacePremium,
  MdOutlineLocalHospital,
  MdVerifiedUser,
} from "react-icons/md";
import { useNavigate } from "react-router";

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate()

  const fetchData = async () => {
    try {
      const response = await Analytics();
      if (response?.success) setStats(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const analyticsList = [
    {
      label: "Advertisements",
      key: "totalAdvertisement",
      icon: <MdCampaign className="text-green-600 text-4xl" />,
      link: "/admin/advertisement",
    },
    {
      label: "Brands",
      key: "totalBrand",
      icon: <MdLocalPharmacy className="text-green-600 text-4xl" />,
      link: "/admin/brands",
    },
    {
      label: "Doctor Advices",
      key: "totalDoctorAdvice",
      icon: <MdHealthAndSafety className="text-green-600 text-4xl" />,
      link: "/admin/doctors",
    },
    {
      label: "Generics",
      key: "totalGeneric",
      icon: <MdScience className="text-green-600 text-4xl" />,
      link: "/admin/generic",
    },
    {
      label: "Leaders",
      key: "totalLeader",
      icon: <MdGroups className="text-green-600 text-4xl" />,
      link: "/admin/leaders",
    },
    {
      label: "Medical Tests",
      key: "totalMedicalTest",
      icon: <MdWorkspacePremium className="text-green-600 text-4xl" />,
      link: "/admin/medical-test",
    },
    {
      label: "News",
      key: "totalNews",
      icon: <MdNewspaper className="text-green-600 text-4xl" />,
      link: "/admin/news",
    },
    {
      label: "Pharmaceuticals",
      key: "totalPharmaceutical",
      icon: <MdOutlineLocalHospital className="text-green-600 text-4xl" />,
      link: "/admin/pharmaceuticals",
    },
    {
      label: "Trusted Centers",
      key: "totalTrustedCenter",
      icon: <MdVerifiedUser className="text-green-600 text-4xl" />,
      link: "/admin/trusted-center",
    },
  ];

  return (
    <div className="w-full max-w-[84vw] mx-auto p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Admin Analytics Overview
      </h2>

      {loading ? (
        <div className="text-center text-gray-600 py-16 text-lg">
          Loading analytics...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {analyticsList.map((item, index) => (
            <motion.div
              onClick={() => navigate(item.link)}
              key={item.key}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="bg-white border border-gray-200 rounded-xl shadow-md p-6 flex flex-col items-center justify-center hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
            >
              <div className="mb-3">{item.icon}</div>
              <p className="text-gray-600 text-sm mb-1">{item.label}</p>
              <h3 className="text-3xl font-bold text-green-600">
                {stats?.[item.key] ?? 0}
              </h3>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;
