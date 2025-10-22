import React from "react";
import "./AdvertisementCard.css";

const AdvertisementCard = ({
  organization,
  position,
  image,
  title,
  link,
  publishDate,
  unpublishDate,
  isActive
}) => {
  return (
    <div className="ad-container">
      <div className="ad-card">
        <h2 className="ad-title">{title || "Advertisement"}</h2>

        <div className="ad-image">
          <img
            src={image || "https://via.placeholder.com/200"}
            alt={title || "Ad Image"}
          />
        </div>

        <div className="ad-details">
          <p><strong>Organization:</strong> {organization || "N/A"}</p>
          <p><strong>Position:</strong> {position || "Sidebar Right"}</p>
          <p><strong>Link:</strong> <a href={link} target="_blank" rel="noopener noreferrer">{link || "N/A"}</a></p>
          <p><strong>Published Date:</strong> {publishDate || "N/A"}</p>
          <p><strong>Unpublished Date:</strong> {unpublishDate || "N/A"}</p>
          <p>
            <strong>Is Active:</strong>{" "}
            <span className={isActive ? "active" : "inactive"}>
              {isActive ? "Yes" : "No"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdvertisementCard;
