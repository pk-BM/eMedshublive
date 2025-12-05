import CarouselMeds from "../../components/Home/CarouselMeds";
import { Heading } from "../../components/Heading/Heading";

import Brands from "../../components/Home/Brands/Brands";
import Test from "../../components/Home/Test/Test";
import News from "../../components/Home/News/News";
import DoctorCarousel from "../../components/Home/DoctorCarousel/DoctorCarousel";

const Home = () => {
  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      {/* <div className="relative w-full min-h-[30rem] border-y-4 border-tertiary flex flex-col items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: "url(/cover.jpg)" }}
        ></div>
        <div className="absolute inset-0 bg-black/40"></div>
      </div> */}

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
