import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// Images
import img1 from "../../assets/Carousel/1.webp";
import img2 from "../../assets/Carousel/2.webp";
import img3 from "../../assets/Carousel/3.webp";
import img4 from "../../assets/Carousel/4.webp";
import img5 from "../../assets/Carousel/5.webp";
import img6 from "../../assets/Carousel/6.webp";

const CarouselMeds = () => {
  const images = [img1, img2, img3, img4, img5, img6];

  return (
    <div className="w-full px-6 md:px-28 h-[250px] md:h-[500px] lg:h-[600px] relative mt-20">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 1500, // 1.5s delay
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        loop={true}
        speed={1000} // 1s transition
        className="w-full h-full"
      >
        {images.map((img, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={img}
              alt={`Slide ${idx}`}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CarouselMeds;
