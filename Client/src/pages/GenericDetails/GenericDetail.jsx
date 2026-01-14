import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { MdOutlineMedicalServices } from "react-icons/md";
import { FaFilePdf } from "react-icons/fa";
import { GetGenericById } from "../../lib/APIs/genericAPI";
import { Link, useNavigate } from "react-router";
import { CiTablets1 } from "react-icons/ci";
import { IoClose } from "react-icons/io5";


const GenericDetails = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()
  const [otherCombinationsModel, setOtherCombinationsModel] = useState(false)

  const fetchGenericDetails = async () => {
    try {
      setLoading(true);
      const response = await GetGenericById(id);
      setFormData(response?.data || {});
    } catch (error) {
      console.error(error);
      toast.error("Error fetching generic details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchGenericDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600 text-sm">
        Loading generic details...
      </div>
    );
  }

  const sections = [
    { title: "Indications", key: "indication" },
    { title: "Pharmacology", key: "pharmacology" },
    { title: "Dosage & Administration", key: "dosageAndAdministration" },
    { title: "Interaction", key: "interaction" },
    { title: "Contraindication", key: "contraindication" },
    { title: "Side Effects", key: "sideEffect" },
    { title: "Pregnancy & Lactation", key: "pregnancyAndLactation" },
    { title: "Overdose Effect", key: "overdoseEffect" },
    { title: "Therapeutic Class", key: "therapeuticClass" },
    { title: "Storage Condition", key: "storageCondition" },
  ];

  const handleOpenPDF = (pdfUrl) => {
    // Ensure it opens in a new tab instead of downloading
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };

  const handleRedirect = (id) => {
    setOtherCombinationsModel(false);
    navigate(`/generics/${id}`)
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-28 py-6 sm:py-10 font-inter flex flex-col lg:flex-row items-start w-full gap-6">
        <div
          className={`w-full mx-auto ${formData?.availableBrands?.length > 0 ? "lg:max-w-[65%]" : "max-w-full"
            }`}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-10 border-b-2 border-green-200 pb-4 gap-4">
            <div className="flex items-center gap-3">
              <MdOutlineMedicalServices className="text-[#34d399] text-3xl sm:text-4xl" />
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800">
                {formData.name || "Generic Details"}
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">

              {formData.otherCombinations?.length > 0 && <button
                onClick={() => { setOtherCombinationsModel(true) }}
                className="cursor-pointer bg-[#34d399] hover:bg-[#2fb386] text-white text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-md shadow-md transition flex items-center justify-center gap-2"
              >
                <FaFilePdf className="text-white text-base sm:text-lg" />
                <span className="whitespace-nowrap">Other combinations</span>
              </button>}


              {formData.innovatorMonograph && (
                <button
                  onClick={() => handleOpenPDF(formData.innovatorMonograph)}
                  className="bg-[#34d399] hover:bg-[#2fb386] text-white text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-md shadow-md transition flex items-center justify-center gap-2"
                >
                  <FaFilePdf className="text-white text-base sm:text-lg" />
                  <span className="whitespace-nowrap">Innovator's Monograph</span>
                </button>

              )}


            </div>

          </div>

          {/* Image Section */}
          {formData.structureImage && (
            <div className="flex justify-center mb-6 sm:mb-10">
              <img
                src={formData.structureImage}
                alt={formData.name}
                className="w-full sm:w-[90%] lg:w-[80%] max-w-5xl rounded-xl shadow-md border border-gray-200 object-contain"
                style={{ maxHeight: "80vh" }}
              />
            </div>
          )}

          {/* Dynamic Sections */}
          {sections.map(
            (section, idx) =>
              formData[section.key] && (
                <div key={idx} className="mb-6 sm:mb-8">
                  <div className="bg-[#34d399] text-white px-3 sm:px-4 py-2 rounded-t-md shadow-sm">
                    <h3 className="text-base sm:text-lg font-semibold tracking-wide">
                      {section.title}
                    </h3>
                  </div>

                  <div
                    className="bg-white border border-green-100 p-4 sm:p-5 rounded-b-md shadow-sm text-gray-700 leading-relaxed prose prose-sm max-w-none text-sm sm:text-base"
                    dangerouslySetInnerHTML={{
                      __html: formData[section.key],
                    }}
                  ></div>
                </div>
              )
          )}
        </div>
        {formData?.availableBrands?.length > 0 && (
          <div className="w-full lg:max-w-[35%] mx-auto px-0 sm:px-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
                Available Brands Name
              </h2>
              <Link
                to="/brands-allophathic"
                className="bg-[#34d399] hover:bg-[#2fb386] text-white text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-md shadow-md transition flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-5">
              {formData.availableBrands?.map((item, index) => (
                <Link
                  to={`/brands/${item?._id}`}
                  key={index}
                  className="group p-3 sm:p-2 hover:bg-tertiary rounded-md hover:text-white cursor-pointer border border-gray-200 sm:border-0 transition-all"
                >
                  <div className="flex items-center gap-1">
                    <CiTablets1 size={24} className="flex-shrink-0" />{" "}
                    <p className="font-semibold text-base sm:text-lg line-clamp-1">{item.name}</p>
                  </div>

                  <p className="text-xs sm:text-sm mt-1 line-clamp-1">{item?.manufacturer?.name}</p>
                  <p className="text-xs sm:text-sm text-tertiary group-hover:text-white mt-1">
                    Unit Price: {item?.totalPrice}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      {
        otherCombinationsModel && (
          <div
            className="w-full h-full fixed top-0 left-0 z-[9999] flex items-center justify-center px-4"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="relative w-full max-w-lg bg-white rounded-md p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 pr-8">
                Other Combinations
              </h3>

              {/* Close Icon */}
              <button
                onClick={() => setOtherCombinationsModel(false)}
                className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <IoClose size={24} />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {formData.otherCombinations?.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleRedirect(item._id)}
                    className="p-3 sm:p-2 hover:bg-tertiary transition-colors duration-300 rounded-md hover:text-white cursor-pointer border border-gray-200 text-sm sm:text-base"
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      }

    </>
  );
};

export default GenericDetails;
