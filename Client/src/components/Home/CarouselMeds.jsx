import React, { useEffect, useState } from "react";
import { LimitedBanners } from "../../lib/APIs/bannerAPI";

const CarouselMeds = () => {
  const [images, setImages] = useState([]);
  const [verticalPool, setVerticalPool] = useState([]);
  const [verticalLeft, setVerticalLeft] = useState([]);
  const [verticalRight, setVerticalRight] = useState([]);

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const pickRandom = (arr, count) => shuffle(arr).slice(0, count);

  const fetchBanners = async () => {
    try {
      const res = await LimitedBanners();
      const banners = res.data || [];

      // Horizontal
      const bannerImages = banners.horizontalBanners.map((b) => b.bannerImgUrl);
      setImages(pickRandom(bannerImages, bannerImages.length));

      // Vertical — full pool
      const verticalImages = banners.verticalBanners.map((b) => b.bannerImgUrl);
      setVerticalPool(verticalImages);

      // Initial random 4 vertical images
      const random4 = pickRandom(verticalImages, 4);
      setVerticalLeft(random4.slice(0, 2));
      setVerticalRight(random4.slice(2, 4));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Auto shuffle horizontal + vertical every 3 sec
  useEffect(() => {
    const interval = setInterval(() => {
      // Shuffle horizontal
      setImages((prev) => shuffle(prev));

      // Shuffle vertical — 4 unique at a time
      if (verticalPool.length >= 4) {
        const random4 = pickRandom(verticalPool, 4);
        setVerticalLeft(random4.slice(0, 2));
        setVerticalRight(random4.slice(2, 4));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [verticalPool]);

  return (
    <div className="w-full px-4 py-10 bg-gray-50 flex items-start gap-4">
      {/* LEFT Vertical */}
      <div className="hidden md:flex flex-col items-start gap-4">
        {verticalLeft.map((src, idx) => (
          <img
            key={"L" + idx}
            src={src}
            alt=""
            className="w-45 h-90 object-cover rounded-md shadow-2xl"
          />
        ))}
      </div>

      {/* Horizontal Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mx-auto">
        {images.map((img, idx) => (
          <div key={img + idx} className="relative overflow-hidden">
            <img
              src={img}
              alt={`Banner ${idx}`}
              className="w-full h-40 object-cover rounded-md shadow-2xl border border-gray-200"
            />
          </div>
        ))}
      </div>

      {/* RIGHT Vertical */}
      <div className="hidden md:flex flex-col items-start gap-4">
        {verticalRight.map((src, idx) => (
          <img
            key={"R" + idx}
            src={src}
            alt=""
            className="w-45 h-90 object-cover rounded-md shadow-2xl"
          />
        ))}
      </div>
    </div>
  );
};

export default CarouselMeds;
