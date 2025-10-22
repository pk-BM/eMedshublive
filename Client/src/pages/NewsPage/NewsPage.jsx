import React, { useEffect, useState } from "react";
import "./NewsPage.css";
import NewsCard from "../../components/News/NewsCard";
import { GetAllNews } from "../../lib/APIs/newsAPI.js";

const NewsPage = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await GetAllNews(); 
        setNewsList(response.data || []); 
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="news-page">
      {loading ? (
        <p className="text-center text-gray-600 text-lg">Loading news...</p>
      ) : newsList.length > 0 ? (
        newsList.map((news) => (
          <NewsCard
            key={news._id}
            title={news.title}
            description={news.description}
            image={news.image}
            publishDate={news.publishDate}
            unpublishDate={news.unpublishDate}
            isActive={news.isActive}
          />
        ))
      ) : (
        <p className="text-center text-gray-600 text-lg">
          No news available at the moment.
        </p>
      )}
    </div>
  );
};

export default NewsPage;
