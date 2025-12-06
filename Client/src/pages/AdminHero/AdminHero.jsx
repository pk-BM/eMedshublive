import React, { useState } from "react";
import { toast } from "react-toastify";
import { uploadHero } from "../../lib/APIs/heroAPIs";

const AdminHero = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Handle file change
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  // Upload to backend
  const handleUpload = async () => {
    if (!file) return toast.error("Select a file first!");

    try {
      const res = await uploadHero(file);
      toast.success(res?.message || "Hero updated");
      setOpenPopup(false);
      setFile(null);
      setPreview(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-10">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-8">
        <h2 className="text-2xl font-semibold text-slate-800 tracking-wide">
          Hero Section
        </h2>
        <button
          onClick={() => setOpenPopup(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Edit Hero
        </button>
      </div>

      {/* Popup Modal */}
      {openPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6 relative">
            <h3 className="text-xl font-semibold mb-4">Update Hero Section</h3>

            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 flex flex-col items-center justify-center">
              {!preview ? (
                <>
                  <p className="text-gray-600 mb-2">Select an image or GIF</p>
                  <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </>
              ) : (
                <>
                  <img
                    src={preview}
                    alt="hero preview"
                    className="w-full max-h-60 object-contain rounded-lg mb-3"
                  />
                  <button
                    onClick={() => {
                      setPreview(null);
                      setFile(null);
                    }}
                    className="text-red-600 underline text-sm"
                  >
                    Remove File
                  </button>
                </>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => {
                  setOpenPopup(false);
                  setPreview(null);
                  setFile(null);
                }}
                className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHero;
