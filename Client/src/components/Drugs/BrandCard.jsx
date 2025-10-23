import React from "react";
import "./BrandCard.css";

const BrandCard = ({ packImage,name, generic }) => {
  return (
    <div className="product-card">
      {/* Details Section */}
      <div className="product-details">
        <h3 className="product-name">{name || "Product Name"}</h3>
        {/* <p className="product-type">
          <strong>Type:</strong> {productType || "N/A"}
        </p> */}
        <p className="product-generic">
          <strong>Generic:</strong> {generic || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default BrandCard;
