import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { MdOutlineMedicalServices } from "react-icons/md";
import { FaFilePdf } from "react-icons/fa";
import { GetGenericById } from "../../lib/APIs/genericAPI";

const GenericDetails = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-10 font-inter">
      <div className="w-full sm:w-[85%] lg:w-[80%] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 border-b-2 border-green-200 pb-4 gap-4">
          <div className="flex items-center gap-3">
            <MdOutlineMedicalServices className="text-[#34d399] text-4xl" />
            <h2 className="text-3xl font-semibold text-slate-800">
              {formData.name || "Generic Details"}
            </h2>
          </div>

          {formData.innovatorMonograph && (
            <button
              onClick={() => handleOpenPDF(formData.innovatorMonograph)}
              className="bg-[#34d399] hover:bg-[#2fb386] text-white text-sm px-5 py-2.5 rounded-md shadow-md transition flex items-center gap-2"
            >
              <FaFilePdf className="text-white text-lg" />
              View Generic PDF
            </button>
          )}
        </div>

        {/* Image Section */}
        {formData.structureImage && (
          <div className="flex justify-center mb-10">
            <img
              src={formData.structureImage}
              alt={formData.name}
              className="w-[80%] max-w-5xl rounded-xl shadow-md border border-gray-200 object-contain"
              style={{ maxHeight: "80vh" }}
            />
          </div>
        )}

        {/* Dynamic Sections */}
        {sections.map(
          (section, idx) =>
            formData[section.key] && (
              <div key={idx} className="mb-8">
                <div className="bg-[#34d399] text-white px-4 py-2 rounded-t-md shadow-sm">
                  <h3 className="text-lg font-semibold tracking-wide">
                    {section.title}
                  </h3>
                </div>

                <div
                  className="bg-white border border-green-100 p-5 rounded-b-md shadow-sm text-gray-700 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: formData[section.key],
                  }}
                ></div>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default GenericDetails;
