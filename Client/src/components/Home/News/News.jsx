import React from "react";
import { motion } from "framer-motion";
import { FaNewspaper, FaBookOpen } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";

const News = () => {
  const news = [
    { title: "Health Experts Warn of New Flu Strain", date: "Oct 5" },
    { title: "Medical AI Improves Diagnosis Accuracy", date: "Oct 4" },
    { title: "Pharma Giants Announce Merger Deal", date: "Oct 3" },
    { title: "Researchers Develop Pain-Free Vaccine", date: "Oct 2" },
    { title: "Telemedicine Use Doubles in 2025", date: "Oct 1" },
  ];

  const articles = [
    { title: "10 Tips for a Healthy Lifestyle", date: "Oct 5" },
    { title: "Understanding Blood Pressure Levels", date: "Oct 4" },
    { title: "How Nutrition Affects Mental Health", date: "Oct 3" },
    { title: "The Future of Robotic Surgery", date: "Oct 2" },
    { title: "Managing Stress in a Busy Life", date: "Oct 1" },
  ];

  return (
    <div className="flex flex-col md:flex-row justify-center gap-8 px-6 md:px-28">
      {/* News Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-lg shadow-md overflow-hidden w-full md:w-1/2"
      >
        <div className="bg-[#34d399] text-center text-white p-6">
          <FaNewspaper className="text-4xl mx-auto mb-3" />
          <h3 className="text-lg font-semibold tracking-wide">FEATURED NEWS</h3>
        </div>

        <ul className="p-4 space-y-3">
          {news.map((item, i) => (
            <li
              key={i}
              className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-3 rounded-lg transition"
            >
              <div className="flex items-center gap-3">
                <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-md text-sm font-semibold">
                  {item.date}
                </span>
                <span className="text-gray-800 font-medium">{item.title}</span>
              </div>
              <FiArrowRight className="text-pink-500 text-lg" />
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Articles Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white rounded-lg shadow-md overflow-hidden w-full md:w-1/2"
      >
        <div className="bg-[#34d399] text-center text-white p-6">
          <FaBookOpen className="text-4xl mx-auto mb-3" />
          <h3 className="text-lg font-semibold tracking-wide">FEATURED ARTICLES</h3>
        </div>

        <ul className="p-4 space-y-3">
          {articles.map((item, i) => (
            <li
              key={i}
              className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-3 rounded-lg transition"
            >
              <div className="flex items-center gap-3">
                <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-md text-sm font-semibold">
                  {item.date}
                </span>
                <span className="text-gray-800 font-medium">{item.title}</span>
              </div>
              <FiArrowRight className="text-pink-500 text-lg" />
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default News;
