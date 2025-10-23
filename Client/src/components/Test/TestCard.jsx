import React from "react";

const TestCard = ({ image, description }) => {
  return (
    <div className="w-[80%] mx-auto bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden">
      
      {/* Image on top */}
      <div className="w-full h-64 md:h-80">
        <img
          src={image || "https://via.placeholder.com/300?text=Test+Image"}
          alt="Medical Test"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Text below image */}
      <div className="p-6 bg-[#f9fafb] text-right">
        <div
          className="text-base text-[#6b7280] leading-relaxed"
          dangerouslySetInnerHTML={{
            __html:
              description ||
              "<p>No detailed information available for this medical test.</p>",
          }}
        ></div>
      </div>
    </div>
  );
};

export default TestCard;
