import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
import "./NewsCard.css";

const NewsCard = ({ title, description, image, publishDate }) => {
  return (
    <div className="news-container">
      <div className="news-card vertical">
        {/* Image Section */}
        <div className="news-image-top">
          <img
            src={image || "https://via.placeholder.com/600x400?text=No+Image"}
            alt={title || "News"}
          />
        </div>

        {/* Details Section */}
        <div className="news-details-top">
          <h2 className="news-title">{title || "Untitled Article"}</h2>

          <div
            className="news-description"
            dangerouslySetInnerHTML={{ __html: description }}
          ></div>

          {/* Publish Date */}
          {publishDate && (
            <div className="news-date">
              <FaCalendarAlt className="calendar-icon" />
              <span>
                Published on{" "}
                <span className="date-text">
                  {new Date(publishDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
