import React from "react";
import "./TestCard.css";

const   TestCard = ({ name, image, description, trustedCenters = [] }) => {
  return (
    <div className="test-container">
      <div className="test-card">
        {/* Test Name */}
        <h2 className="test-name">{name || "Unnamed Medical Test"}</h2>

        {/* Test Image */}
        <div className="test-image">
          <img
            src={image || "https://via.placeholder.com/300?text=Test+Image"}
            alt={name || "Medical Test"}
          />
        </div>

        {/* Description */}
        <div className="test-description">
          <p>
            {description ||
              "No detailed information available for this medical test."}
          </p>
        </div>

        {/* Trusted Diagnostic Centers */}
        <div className="trusted-centers">
          <h3>Trusted Diagnostic Centers</h3>
          <div className="center-logos">
            {trustedCenters.length > 0 ? (
              trustedCenters.map((center, index) => (
                <img
                  key={index}
                  src={center}
                  alt={`Diagnostic Center ${index + 1}`}
                />
              ))
            ) : (
              <p>No centers available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCard;
