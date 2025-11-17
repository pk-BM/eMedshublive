import React, { useEffect, useState } from "react";
import { LimitedBanners } from "../../lib/APIs/bannerAPI";
import { toast } from "react-toastify";

const CarouselMeds = () => {
  const [images, setImages] = useState([]);

  const shuffleImages = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const fetchBanners = async () => {
    try {
      const res = await LimitedBanners();
      const banners = res.data || [];
      const bannerImages = banners.map((b) => b.bannerImgUrl);
      setImages(shuffleImages(bannerImages));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Automatically shuffle images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setImages((prev) => shuffleImages(prev));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full px-4 md:px-20 py-10 mt-20 bg-gray-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {images.map((img, idx) => (
          <div key={img + idx} className="relative overflow-hidden">
            <img
              src={img}
              alt={`Banner ${idx}`}
              className="w-full h-20 sm:h-40 object-cover rounded-md border border-gray-200"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarouselMeds;
