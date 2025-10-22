import React from "react";
import "./BrandCard.css";

const BrandCard = ({ name, generic }) => {
  return (
    <div className="product-card">
      {/* Details Section */}
      <div className="product-details">
        <h3 className="product-name">{name || "Product Name"}</h3>
        <p className="product-generic">{generic || "N/A"}</p>
      </div>
    </div>
  );
};

export default BrandCard;
