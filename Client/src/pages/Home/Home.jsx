import CarouselMeds from "../../components/Home/CarouselMeds";
import { Heading } from "../../components/Heading/Heading";
import Brands from "../../components/Home/Brands/Brands";
import News from "../../components/Home/News/News";
import DoctorCarousel from "../../components/Home/DoctorCarousel/DoctorCarousel";
import { useEffect, useState } from "react";
import { getHero } from "../../lib/APIs/heroAPIs";

const Home = () => {
  const [hero, setHero] = useState(null);

  useEffect(() => {
    const loadHero = async () => {
      const res = await getHero();
      setHero(res.data);
    };
    loadHero();
  }, []);
  return (
    <div className="w-full min-h-screen">
      <div className="m-4">
        {/* Hero Section */}
        <div className="relative w-full min-h-[18rem] flex flex-col items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={{
              backgroundImage: hero?.image
                ? `url(${hero.image})`
                : "url(/cover.jpg)",
            }}
          ></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      </div>

      {/* Other Sections */}
      <CarouselMeds />

      <News />

      <Heading
        heading="Pharma Leaders"
        text="Effective leadership is characterized by vision, integrity, and the ability to empower others"
      />
      <DoctorCarousel />

      <Heading heading="Product Highlight" text="" />
      <Brands />

      {/* <Heading
        heading="Medical Test"
        text="Find complete details of available medical tests, procedures, and reports."
      />
      <Test /> */}
    </div>
  );
};

export default Home;
