

import CarouselMeds from "../../components/Home/CarouselMeds";
import { Heading } from "../../components/Heading/Heading";

import Brands from "../../components/Home/Brands/Brands";
import Test from "../../components/Home/Test/Test";
import News from "../../components/Home/News/News";
import DoctorCarousel from "../../components/Home/DoctorCarousel/DoctorCarousel";

import SearchBar from "../../components/Search/Searchbar";

const Home = () => {


  return (  
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full min-h-[30rem] border-y-4 border-tertiary flex flex-col items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: "url(/cover.jpg)" }}
        ></div>
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Search Section */}
        <SearchBar />
      </div>

      {/* Other Sections */}
      <CarouselMeds />

      <Heading
        heading="Featured News"
        text="Stay updated with the latest insights, trending stories, and expert articles curated just for you."
      />
      <News />

      <Heading
        heading="Brands"
        text="Explore trusted medical and pharmaceutical brands recommended by professionals."
      />
      <Brands />

      <Heading
        heading="Medical Test"
        text="Find complete details of available medical tests, procedures, and reports."
      />
      <Test />

      <Heading
        heading="Our Leaders"
        text="Effective leadership is characterized by vision, integrity, and the ability to empower others"
      />
      {/* <div className="min-h-screen flex items-center justify-center"> */}
        <DoctorCarousel />
      {/* </div> */}


    </div>
  );
};

export default Home;
