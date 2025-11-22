import React, { useEffect, useState } from "react";
import { LimitedBanners } from "../../lib/APIs/bannerAPI";
import { Link } from "react-router";

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

      // Horizontal — keep full objects (bannerImgUrl + link)
      const horizontal = banners.horizontalBanners;
      setImages(pickRandom(horizontal, horizontal.length));

      // Vertical — store full objects too (not just URL)
      const vertical = banners.verticalBanners;
      setVerticalPool(vertical);

      // Pick 4 unique vertical banner objects
      const random4 = pickRandom(vertical, 4);
      setVerticalLeft(random4.slice(0, 2));
      setVerticalRight(random4.slice(2, 4));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Shuffle every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Shuffle Horizontal
      setImages((prev) => shuffle(prev));

      // Shuffle vertical only if enough items
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
        {verticalLeft.map((item, idx) => (
          <Link
            to={item.link}
            target="_blank"
            key={"VL" + idx}
            className="cursor-pointer"
          >
            <img
              src={item.bannerImgUrl}
              alt=""
              className="w-45 h-90 object-cover rounded-md shadow-2xl"
            />
          </Link>
        ))}
      </div>

      {/* Horizontal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mx-auto">
        {images.map((img, idx) => (
          <Link
            to={img.link}
            target="_blank"
            key={"H" + idx}
            className="relative overflow-hidden"
          >
            <img
              src={img.bannerImgUrl}
              alt={`Banner ${idx}`}
              className="w-full h-40 object-cover rounded-md shadow-2xl border border-gray-200"
            />
          </Link>
        ))}
      </div>

      {/* RIGHT Vertical */}
      <div className="hidden md:flex flex-col items-start gap-4">
        {verticalRight.map((item, idx) => (
          <Link
            to={item.link}
            target="_blank"
            key={"VR" + idx}
            className="cursor-pointer"
          >
            <img
              src={item.bannerImgUrl}
              alt=""
              className="w-45 h-90 object-cover rounded-md shadow-2xl"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CarouselMeds;
