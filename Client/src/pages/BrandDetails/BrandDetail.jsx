import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getBrandById } from "../../lib/APIs/brandsAPI";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  FaPills,
  FaIndustry,
  FaBoxOpen,
  FaMoneyBillWave,
  FaSyringe,
  FaWeightHanging,
  FaCapsules,
  FaTag,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const BrandDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBrand = async () => {
    try {
      setLoading(true);
      const response = await getBrandById(id);
      const brandData = response.data || response;
      setBrand(brandData);
    } catch (error) {
      console.error("Error fetching brand:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch brand details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrand();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg">
        Loading brand details...
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 text-lg">
        Brand not found or unavailable.
      </div>
    );
  }

  const detailBoxes = [
    {
      label: "Product Type",
      value: brand.productType,
      icon: <FaTag className="text-teal-600 text-2xl" />,
    },
    {
      label: "Name",
      value: brand.name,
      icon: <FaPills className="text-teal-600 text-2xl" />,
    },
    {
      label: "Generic",
      value: brand.generic?.name,
      icon: <FaCapsules className="text-teal-600 text-2xl" />,
    },
    {
      label: "Manufacturer",
      value: brand.manufacturer?.name,
      icon: <FaIndustry className="text-teal-600 text-2xl" />,
    },
    {
      label: "Dosage Form",
      value: brand.dosageForm,
      icon: <FaSyringe className="text-teal-600 text-2xl" />,
    },
    {
      label: "Strength",
      value: brand.strength,
      icon: <FaWeightHanging className="text-teal-600 text-2xl" />,
    },
    {
      label: "Pack Size",
      value: brand.packSize,
      icon: <FaBoxOpen className="text-teal-600 text-2xl" />,
    },
    {
      label: "Unit Price",
      value: `Rs. ${brand.unitPrice}`,
      icon: <FaMoneyBillWave className="text-teal-600 text-2xl" />,
    },
    {
      label: "Total Price",
      value: `Rs. ${brand.totalPrice}`,
      icon: <FaMoneyBillWave className="text-teal-600 text-2xl" />,
    },
    brand.bioequivalentDrug === "yes" && {
      label: "Bioequivalent Drug",
      value: `${brand.bioequivalentDrug}`,
      icon: <FaCapsules className="text-teal-600 text-2xl" />,
    },
  ];

  return (
    <motion.div
      className="max-w-5xl mx-auto mt-12 bg-white shadow-xl rounded-3xl p-10 border border-gray-200"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Centered Image */}
      <div className="flex justify-center mb-8">
        <motion.img
          src={
            brand.packImage && brand.packImage.trim() !== ""
              ? brand.packImage
              : "/no-image.png"
          }
          alt={brand.name}
          className="object-contain rounded-2xl border border-gray-200 shadow-sm"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        />
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-teal-700 mb-2 flex items-center justify-center gap-3">
          {brand.name}

          {brand.newProduct === "yes" && (
            <span className="px-3 py-1 text-xs font-semibold bg-teal-600 text-white rounded-full shadow-md animate-pulse">
              NEW PRODUCT
            </span>
          )}
        </h1>

        <p className="text-gray-600 italic">{brand.productType}</p>
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-800">
        {detailBoxes.map(
          (item, index) =>
            item.value && (
              <motion.div
                key={index}
                className={`flex items-center gap-4 bg-gray-50 p-5 rounded-xl shadow-sm hover:shadow-md transition duration-300 ${
                  item.label === "Status" && brand.isActive
                    ? "border border-green-200 bg-green-50"
                    : item.label === "Status" && !brand.isActive
                    ? "border border-red-200 bg-red-50"
                    : ""
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                {item.icon}
                <div>
                  <p className="font-semibold text-gray-700">{item.label}</p>
                  <p
                    className={`text-lg font-medium ${
                      item.label === "Status"
                        ? brand.isActive
                          ? "text-green-700"
                          : "text-red-700"
                        : ""
                    }`}
                  >
                    {item.value}
                  </p>
                </div>
              </motion.div>
            )
        )}
      </div>

      {/* Back Button */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={() => navigate(-1)}
          className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-xl transition-all"
        >
          Back
        </button>
      </div>
    </motion.div>
  );
};

export default BrandDetail;
