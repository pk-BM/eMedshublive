import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { getBrandById } from "../../lib/APIs/brandsAPI";
import { toast } from "react-toastify";
import { CiTablets1 } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { FaImage } from "react-icons/fa";

const BrandDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);

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
      <div className="flex items-center justify-center min-h-screen text-gray-600 text-sm">
        Loading brand details...
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 text-lg">
        Brand not found or unavailable.
      </div>
    );
  }

  // Medical information sections
  const sections = [
    { title: "Indications", key: "indication" },
    { title: "Composition", key: "composition" },
    { title: "Pharmacology", key: "pharmacology" },
    { title: "Dosage & Administration", key: "dosageAndAdministration" },
    { title: "Interaction", key: "interaction" },
    { title: "Contraindications", key: "contraindication" },
    { title: "Side Effects", key: "sideEffect" },
    { title: "Pregnancy & Lactation", key: "pregnancyAndLactation" },
    { title: "Precautions & Warnings", key: "precautionsAndWarnings" },
    { title: "Overdose Effects", key: "overdoseEffect" },
    { title: "Therapeutic Class", key: "therapeuticClass" },
    { title: "Storage Conditions", key: "storageCondition" },
    { title: "Common Questions", key: "commonQuestions" },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-28 py-6 sm:py-10 font-inter flex flex-col lg:flex-row items-start w-full gap-6">
        {/* Main Content */}
        <div
          className={`w-full mx-auto ${brand?.alternateBrands?.length > 0 ? "lg:max-w-[65%]" : "max-w-full"
            }`}
        >
          {/* Header Section */}
          <div className="mb-6 sm:mb-8 border-b-2 border-green-200 pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              {/* Left: Name and Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-gray-500 text-sm">🏷️</span>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                    {brand.name}
                  </h1>
                  <span className="text-gray-500 text-sm">{brand.productType}</span>
                  {brand.newProduct === "yes" && (
                    <span className="px-2 py-0.5 text-xs font-semibold bg-[#34d399] text-white rounded-full">
                      NEW
                    </span>
                  )}
                </div>

                {/* Generic Name Link */}
                {brand.generic?.name && (
                  <Link
                    to={`/generics/${brand.generic._id}`}
                    className="text-[#34d399] hover:underline text-sm sm:text-base font-medium"
                  >
                    {brand.generic.name}
                  </Link>
                )}

                {/* Strength */}
                {brand.strength && (
                  <p className="text-gray-600 text-sm mt-1">{brand.strength}</p>
                )}

                {/* Manufacturer */}
                {brand.manufacturer?.name && (
                  <Link
                    to={`/manufacturers/${brand.manufacturer._id}/brands`}
                    className="text-gray-600 hover:text-[#34d399] text-sm block mt-1"
                  >
                    {brand.manufacturer.name}
                  </Link>
                )}
              </div>

              {/* Right: Pack Image Button */}
              <div className="flex flex-col sm:flex-row gap-2">
                {brand.packImage && brand.packImage.trim() !== "" && (
                  <button
                    onClick={() => setShowImageModal(true)}
                    className="bg-[#34d399] hover:bg-[#2fb386] text-white text-xs sm:text-sm px-4 py-2 rounded-md shadow-md transition flex items-center gap-2"
                  >
                    <FaImage className="text-white" />
                    <span>Pack Image</span>
                  </button>
                )}
                <button
                  onClick={() => navigate(-1)}
                  className="bg-gray-500 hover:bg-gray-600 text-white text-xs sm:text-sm px-4 py-2 rounded-md shadow-md transition"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>

          {/* Price & Basic Info Section */}
          <div className="mb-6 sm:mb-8 bg-white border border-gray-200 rounded-lg p-4 sm:p-5 shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Unit Price */}
              {brand.unitPrice && (
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Unit Price</span>
                  <span className="font-semibold text-slate-800">
                    ৳ {brand.unitPrice}
                  </span>
                </div>
              )}

              {/* Strip Price */}
              {brand.stripPrice && (
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Strip Price</span>
                  <span className="font-semibold text-slate-800">
                    ৳ {brand.stripPrice}
                  </span>
                </div>
              )}

              {/* Total/Pack Price */}
              {brand.totalPrice && (
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Pack Price</span>
                  <span className="font-semibold text-slate-800">
                    ৳ {brand.totalPrice}
                  </span>
                </div>
              )}

              {/* Dosage Form */}
              {brand.dosageForm && (
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Dosage Form</span>
                  <span className="font-semibold text-slate-800">
                    {brand.dosageForm}
                  </span>
                </div>
              )}

              {/* Pack Size */}
              {brand.packSize && (
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Pack Size</span>
                  <span className="font-semibold text-slate-800">
                    {brand.packSize}
                  </span>
                </div>
              )}

              {/* Bioequivalent Drug */}
              {brand.bioequivalentDrug === "yes" && (
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Bioequivalent</span>
                  <span className="font-semibold text-[#34d399]">Yes</span>
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Medical Sections */}
          {sections.map(
            (section, idx) =>
              brand[section.key] && (
                <div key={idx} className="mb-6 sm:mb-8">
                  <div className="bg-[#34d399] text-white px-3 sm:px-4 py-2 rounded-t-md shadow-sm">
                    <h3 className="text-base sm:text-lg font-semibold tracking-wide">
                      {section.title}
                    </h3>
                  </div>
                  <div className="bg-white border border-gray-200 border-t-0 p-4 sm:p-5 rounded-b-md shadow-sm text-gray-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                    {brand[section.key]}
                  </div>
                </div>
              )
          )}

          {/* Pack Image at Bottom */}
          {brand.packImage && brand.packImage.trim() !== "" && (
            <div className="mb-6 sm:mb-8 flex flex-col items-center">
              <img
                src={brand.packImage}
                alt={`Pack Image: ${brand.name}`}
                className="max-w-xs sm:max-w-sm rounded-lg shadow-md border border-gray-200 cursor-pointer hover:shadow-lg transition"
                onClick={() => setShowImageModal(true)}
              />
              <p className="text-gray-500 text-sm mt-2">
                Pack Image: {brand.name}
              </p>
            </div>
          )}
        </div>

        {/* Alternate Brands Sidebar */}
        {brand?.alternateBrands?.length > 0 && (
          <div className="w-full lg:max-w-[35%] mx-auto px-0 sm:px-4">
            <div className="bg-[#34d399] text-white px-3 sm:px-4 py-2 rounded-t-md shadow-sm">
              <h3 className="text-base sm:text-lg font-semibold tracking-wide">
                Alternate Brands
              </h3>
            </div>
            <div className="bg-white border border-gray-200 border-t-0 rounded-b-md shadow-sm p-4">
              <div className="grid grid-cols-1 gap-3">
                {brand.alternateBrands.map((altBrand, index) => (
                  <Link
                    to={`/brands/${altBrand._id}`}
                    key={index}
                    className="group p-3 hover:bg-tertiary rounded-md hover:text-white cursor-pointer border border-gray-200 transition-all flex items-center gap-3"
                  >
                    {/* Brand Image */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-lg overflow-hidden bg-white border border-gray-200">
                      <img
                        src={
                          altBrand.packImage && altBrand.packImage.trim() !== ""
                            ? altBrand.packImage
                            : "/no-image.png"
                        }
                        alt={altBrand.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <CiTablets1 size={18} className="flex-shrink-0" />
                        <p className="font-semibold text-sm sm:text-base line-clamp-1">
                          {altBrand.name}
                        </p>
                      </div>
                      {altBrand.strength && (
                        <p className="text-xs mt-0.5 line-clamp-1 text-gray-600 group-hover:text-white/80">
                          {altBrand.strength}
                        </p>
                      )}
                      {altBrand.unitPrice && (
                        <p className="text-xs text-tertiary group-hover:text-white mt-0.5">
                          ৳ {altBrand.unitPrice}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              <Link
                to="/brands-allophathic"
                className="mt-4 block text-center bg-[#34d399] hover:bg-[#2fb386] text-white text-xs sm:text-sm px-4 py-2 rounded-md shadow-md transition"
              >
                View All Brands
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && brand.packImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="relative bg-white rounded-lg p-4 max-w-3xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer bg-white rounded-full p-1 shadow-md"
            >
              <IoClose size={24} />
            </button>

            <img
              src={brand.packImage}
              alt={brand.name}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />

            <p className="text-center text-gray-600 mt-3 text-sm">
              {brand.name} - Pack Image
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default BrandDetail;
