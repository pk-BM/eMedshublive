import React, { useEffect, useState } from "react";
import { Create, GetAbout, Update } from "../lib/APIs/aboutAPI";
import { toast } from "react-toastify";

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openPopup, setOpenPopup] = useState(false);
  const [aboutText, setAboutText] = useState("");

  const fetchAbout = async () => {
    try {
      const res = await GetAbout();
      setAboutData(res.data || null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Fetch About Error", error);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  const handleCreate = async () => {
    if (!aboutText.trim()) return toast.error("About text required");

    try {
      const res = await Create(aboutText);
      toast.success(res.message);
      setOpenPopup(false);
      fetchAbout();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Create failed");
    }
  };

  const handleUpdate = async () => {
    if (!aboutText.trim()) return toast.error("About text required");

    try {
      const res = await Update(aboutText, aboutData?._id);
      toast.success(res.message);
      setOpenPopup(false);
      fetchAbout();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const openAdd = () => {
    setAboutText("");
    setOpenPopup(true);
  };

  const openEdit = () => {
    setAboutText(aboutData?.about || "");
    setOpenPopup(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-10 font-inter">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 border-b-2 border-green-200 pb-4">
        <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
          About
        </h2>

        {aboutData ? (
          <button
            onClick={openEdit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Edit About
          </button>
        ) : (
          <button
            onClick={openAdd}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Add About
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : aboutData ? (
        <div className="bg-white shadow-md p-5 rounded-lg">
          <p className="text-gray-700 leading-relaxed">{aboutData.about}</p>
        </div>
      ) : (
        <p className="text-gray-500">No about information added yet.</p>
      )}

      {openPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center px-4 z-50"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg relative">
            <h3 className="text-xl font-semibold mb-4">
              {aboutData ? "Update About" : "Create About"}
            </h3>

            <textarea
              rows="6"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-green-300 outline-none"
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              placeholder="Write about text..."
            ></textarea>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setOpenPopup(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 text-slate-800 hover:bg-gray-400"
              >
                Cancel
              </button>

              {aboutData ? (
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update
                </button>
              ) : (
                <button
                  onClick={handleCreate}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;
