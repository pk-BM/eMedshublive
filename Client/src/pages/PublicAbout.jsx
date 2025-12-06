import React, { useEffect, useState } from "react";
import { GetAbout } from "../lib/APIs/aboutAPI";

const PublicAbout = () => {
  const [loading, setLoading] = useState(true);
  const [aboutData, setAboutData] = useState("");

  const fetchAbout = async () => {
    try {
      const res = await GetAbout();
      setAboutData(res.data.about);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Fetch About Error", error);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="my-10 px-6 md:px-28">
      <h1 className="text-3xl font-bold">About Us</h1>
      <p className="mt-6 text-sm text-gray-600">{aboutData}</p>
    </div>
  );
};

export default PublicAbout;
