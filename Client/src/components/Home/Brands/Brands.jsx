import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Autoplay, Pagination } from "swiper/modules";

import "./Brands.css";

import img1 from "../../../assets/Carousel/1.webp";
import img2 from "../../../assets/Carousel/2.webp";
import img3 from "../../../assets/Carousel/3.webp";
import img4 from "../../../assets/Carousel/4.webp";
import img5 from "../../../assets/Carousel/5.webp";
import img6 from "../../../assets/Carousel/6.webp";

export default function Brands() {
  const brands = [
    { img: img1, name: "Brand One" },
    { img: img2, name: "Brand Two" },
    { img: img3, name: "Brand Three" },
    { img: img4, name: "Brand four" },
    { img: img5, name: "Brand five" },
    { img: img6, name: "Brand six" },
  ];

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
        {brands.map((brand, index) => (
          <SwiperSlide key={index}>
            <div className="brand-card">
              <img src={brand.img} alt={brand.name} />
              <p>{brand.name}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
