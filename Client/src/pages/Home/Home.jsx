import { motion } from "framer-motion";
import CarouselMeds from "../../components/Home/CarouselMeds";
import { Heading } from "../../components/Heading/Heading";
import Brands from "../../components/Home/Brands/Brands";
import Test from "../../components/Home/Test/Test"
import News from "../../components/Home/News/News"

const Home = () => {
  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full min-h-[30rem] border-y-4 border-tertiary flex flex-col items-center justify-center overflow-hidden">
        {/* Background Image (blurred) */}
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: "url(/cover.jpg)" }}
        ></div>

        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content on top */}
        <div className="relative z-10 flex flex-col items-center">
          <motion.h1
            className="text-xl md:text-4xl font-bold text-white text-center mb-6"
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            Search by Brands & Generic Names
          </motion.h1>
          <motion.div
            className="flex items-center justify-center w-full max-w-xs md:max-w-xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          >
            <input
              type="text"
              placeholder="Ex. Brands, Medicine ..."
              className="w-full focus:outline-none font-semibold placeholder:font-semibold placeholder:text-gray-500 bg-white text-black px-3 py-3 md:py-4 rounded-l-md"
            />
            <p className="text-white bg-tertiary hover:bg-secondary cursor-pointer transition-all duration-300 px-4 md:px-8 py-3 md:py-4 font-semibold rounded-r-md">
              Search
            </p>
          </motion.div>
        </div>
      </div>
      <CarouselMeds />
      <Heading heading="Featured News & Articles" text="Stay updated with the latest insights, trending stories, and expert articles curated just for you." />
      <News/>
      {/* <Heading heading="Featured Videos" text="Watch our latest videos covering highlights, tutorials, and stories you don’t want to miss."/> */}

    
      <Heading heading="Brands" text="Explore trusted medical and pharmaceutical brands recommended by professionals." />
      <Brands/>    

      <Heading heading="Medical Test" text="Find complete details of available medical tests, procedures, and reports." />
      <Test/>
    </div>
  );
};

export default Home;
