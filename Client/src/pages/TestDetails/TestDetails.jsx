import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { GetTestById } from "../../lib/APIs/testAPI.js";
import { TrustedCenterOptions } from "../../lib/APIs/TrustedCenterAPI.js";
import { MdOutlineMedicalServices } from "react-icons/md";
import { toast } from "react-toastify";

const TestDetails = () => {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [trustedCenters, setTrustedCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingCenters, setFetchingCenters] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchMedicalTest = async () => {
      try {
        setLoading(true);
        const res = await GetTestById(id);
        const data = res.data || res;
        setTest(data);
      } catch (err) {
        console.error(err);
        setErrorMessage("Failed to load medical test details.");
        toast.error(err.response?.data?.message || "Failed to fetch test details");
      } finally {
        setLoading(false);
      }
    };

    const fetchTrustedCenters = async () => {
      try {
        setFetchingCenters(true);
        const response = await TrustedCenterOptions();
        setTrustedCenters(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching trusted centers:", err);
        toast.error(err.response?.data?.message || "Failed to fetch centers");
      } finally {
        setFetchingCenters(false);
      }
    };

    fetchMedicalTest();
    fetchTrustedCenters();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-medium text-[#6b7280]">
        Loading test details...
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex justify-center items-center min-h-screen text-[#ec4899] text-lg">
        {errorMessage}
      </div>
    );
  }

  if (!test) {
    return (
      <div className="flex justify-center items-center min-h-screen text-[#6b7280] text-lg">
        No test found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] font-inter pt-0 pb-10">
    {/* ===== Hero Section ===== */}
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-green-200 to-green-400 flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-[#f9fafb] bg-opacity-20"></div>
        <div className="relative z-10 px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-black flex items-center justify-center gap-2">
            <MdOutlineMedicalServices className="text-[#34d399] text-4xl" />
            {test.name}
          </h1>
          <p className="text-black text-sm md:text-base mt-2 max-w-2xl mx-auto">
            Learn everything you need to know about this test — its purpose,
            process, and where to get it done.
          </p>
        </div>
      </div>

      {/* ===== Blog Content ===== */}
      <div className="max-w-4xl mx-auto px-5 py-10 bg-[#ffffff] mt-[-4rem] rounded-xl shadow-lg relative z-10 border border-[#34d399]/20">
        {test.image && (
          <img
            src={test.image}
            alt={test.name}
            className="w-full h-64 object-cover rounded-lg mb-6 border border-[#34d399]/30"
          />
        )}

        <div className="max-w-none text-[#1f2937] leading-relaxed">
          <h2 className="text-2xl font-semibold text-[#1f2937] mb-4 border-b-2 border-[#34d399]/30 pb-2">
           {test.name}
          </h2>

          <div
            className="text-base text-[#6b7280] prose max-w-none"
            dangerouslySetInnerHTML={{ __html: test.description }}
          ></div>
        </div>
      </div>

      {/* ===== Trusted Centers Section ===== */}
      <div className="max-w-5xl mx-auto mt-12 mb-16 px-5">
        <h3 className="text-2xl font-semibold text-[#1f2937] mb-6 border-b-2 border-[#34d399]/30 pb-2">
          Available at Trusted Centers
        </h3>

        {fetchingCenters ? (
          <p className="text-[#6b7280]">Fetching trusted centers...</p>
        ) : trustedCenters.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {trustedCenters.map((center) => (
              <div
                key={center._id}
                className="flex flex-col items-center bg-[#ffffff] border border-[#34d399]/30 p-4 rounded-lg hover:shadow-md transition duration-300 hover:bg-[#34d399] hover:text-white"
              >
                <img
                  src={center.logo}
                  alt={center.name}
                  className="w-20 h-20 object-contain mb-3 rounded-md bg-[#f9fafb] p-2"
                />
                <p className="text-[#1f2937] font-medium text-center text-sm transition-colors duration-300 hover:text-white">
                  {center.name}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#6b7280]">No trusted centers available.</p>
        )}
      </div>
    </div>
  );
};

export default TestDetails;
