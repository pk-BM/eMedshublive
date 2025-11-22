import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";

import "./Brands.css";

import { GetBrandImages } from "../../../lib/APIs/brandsAPI";

export default function Brands() {
  const [brandsPackImage, setBrandsPackImage] = useState([]);

  const getBrandImages = async () => {
    try {
      const response = await GetBrandImages();
      setBrandsPackImage(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBrandImages();
  }, []);

  return (
    <div className="brands-slider">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={30}
        slidesPerView={3}
        loop={true}
        autoplay={{ delay: 2000 }}
        // pagination={{ clickable: false }}
        breakpoints={{
          1024: { slidesPerView: 4 },
          768: { slidesPerView: 3 },
          480: { slidesPerView: 2 },
        }}
      >
        {brandsPackImage.map((brand, index) => (
          <SwiperSlide key={index}>
            <div className="brand-card">
              <img src={brand.packImage} alt={brand._id} />
              <p>{brand.name}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
