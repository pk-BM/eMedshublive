import React, { useState } from "react";
import { Link } from "react-router";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileSiteActive, setMobileSiteActive] = useState(false);

  const dropdownItems = {
    MORE: [
      { title: "News", link: "/news" },
      { title: "Doctors Advice", link: "/doctor-advice" },
      { title: "Medical Test", link: "/tests" },
    ],
    MEDICINE: [
      { title: "Generics (Allopathic)", link: "/generics-allophathic" },
      { title: "Generics (Herbal)", link: "/generics-herbal" },
    ],
    BRANDS: [
      { title: "Brands (Allopathic)", link: "/brands-allophathic" },
      { title: "Brands (Herbal)", link: "/brands-herbal" },
    ],
  };
  const toggleMobileSideMenu = () => {
    setMobileSiteActive((prev) => !prev);
  };

  return (
    <div className="flex justify-between items-center w-full h-20 px-6 md:px-28 relative">
      {/* Logo */}
      <Link to="/" className="text-2xl md:text-3xl font-bold">
        eMedsHub
      </Link>

      {/* Hamburger */}
      <div className="block md:hidden">
        <GiHamburgerMenu
          size={24}
          className="cursor-pointer"
          onClick={toggleMobileSideMenu}
        />
      </div>

      {/* ===== Mobile Sidebar ===== */}
      <AnimatePresence>
        {mobileSiteActive && (
          <>
            {/* Dark overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-40"
              onClick={toggleMobileSideMenu}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="fixed top-0 left-0 w-[80%] sm:w-[60%] h-full bg-white z-50 shadow-lg p-6 flex flex-col"
            >
              <div className="flex justify-end items-center mb-6">
                <button
                  onClick={toggleMobileSideMenu}
                  className="p-2 bg-gray-200 rounded-full"
                >
                  <IoClose size={24} />
                </button>
              </div>

              <ul className="space-y-4">
                <li className="font-medium">GENERICS</li>
                <ul className="pl-3 space-y-2">
                  {dropdownItems.MEDICINE.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-600 cursor-pointer"
                    >
                      <Link
                        to={item.link}
                        className="block w-full"
                        onClick={() => setMobileSiteActive(false)}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>

                <ul className="pl-3 space-y-2"></ul>
                <Link
                  to="/pharmaceuticals"
                  className="block w-full"
                  onClick={() => setMobileSiteActive(false)}
                >
                  <li className="font-medium">PHARMACEUTICALS</li>
                </Link>

                <li className="font-medium">BRANDS</li>
                <ul className="pl-3 space-y-2">
                  {dropdownItems.BRANDS.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-600 cursor-pointer"
                    >
                      <Link
                        to={item.link}
                        className="block w-full"
                        onClick={() => setMobileSiteActive(false)}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>

                <li className="font-medium">MORE</li>
                <ul className="pl-3 space-y-2">
                  {dropdownItems.MORE.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-600 cursor-pointer"
                    >
                      <Link
                        to={item.link}
                        className="block w-full"
                        onClick={() => setMobileSiteActive(false)}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>

                <li className="font-medium">CONTACT</li>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ===== Desktop Menu ===== */}
      <ul className="hidden md:flex items-center gap-2 relative">
        {/* MEDICINE with dropdown */}
        <li
          className="relative group cursor-pointer"
          onMouseEnter={() => setOpenDropdown("MEDICINE")}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          <p className="text-sm hover:text-secondary hover:underline transition-all duration-300 font-medium p-3 flex items-center gap-1">
            <span>GENERICS</span>
            <IoIosArrowDown size={16} />
          </p>
          <AnimatePresence>
            {openDropdown === "MEDICINE" && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute left-0 text-gray-600 bg-white shadow-lg rounded-md p-2 w-full min-w-[16rem] z-50"
              >
                {dropdownItems.MEDICINE.map((item, idx) => (
                  <motion.li
                    key={idx}
                    whileHover={{ x: 8, color: "#0d9488" }}
                    transition={{ type: "tween", duration: 0.2 }}
                    className="px-4 py-2 text-gray-600 rounded-md text-sm cursor-pointer"
                  >
                    <Link to={item.link}>{item.title}</Link>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </li>

        {/* INDICATIONS */}
        <Link
          to="/pharmaceuticals"
          className="text-sm hover:text-secondary hover:underline transition-all duration-300 font-medium cursor-pointer p-3"
        >
          PHARMACEUTICALS
        </Link>

        {/* Brands with dropdown */}
        <li
          className="relative group cursor-pointer"
          onMouseEnter={() => setOpenDropdown("BRANDS")}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          <p className="text-sm hover:text-secondary hover:underline transition-all duration-300 font-medium p-3 flex items-center gap-1">
            <span>BRANDS</span>
            <IoIosArrowDown size={16} />
          </p>
          <AnimatePresence>
            {openDropdown === "BRANDS" && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute left-0 text-gray-600 bg-white shadow-lg rounded-md p-2 w-full min-w-[16rem] z-50"
              >
                {dropdownItems.BRANDS.map((item, idx) => (
                  <motion.li
                    key={idx}
                    whileHover={{ x: 8, color: "#0d9488" }}
                    transition={{ type: "tween", duration: 0.2 }}
                    className="px-4 py-2 text-gray-600 rounded-md text-sm cursor-pointer"
                  >
                    <Link to={item.link}>{item.title}</Link>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </li>

        {/* MORE with dropdown */}
        <li
          className="relative group cursor-pointer"
          onMouseEnter={() => setOpenDropdown("MORE")}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          <p className="text-sm hover:text-secondary hover:underline transition-all duration-300 font-medium p-3 flex items-center gap-1">
            <span>MORE</span>
            <IoIosArrowDown size={16} />
          </p>

          <AnimatePresence>
            {openDropdown === "MORE" && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute left-0 text-gray-600 bg-white shadow-lg rounded-md p-2 w-full min-w-[16rem] z-50"
              >
                {dropdownItems.MORE.map((item, idx) => (
                  <motion.li
                    key={idx}
                    whileHover={{ x: 8, color: "#0d9488" }}
                    transition={{ type: "tween", duration: 0.2 }}
                    className="px-4 py-2 text-gray-600 rounded-md text-sm cursor-pointer"
                  >
                    <Link to={item.link}>{item.title}</Link>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </li>

        {/* CONTACT */}
        <Link
          to="#"
          className="text-sm hover:text-secondary hover:underline transition-all duration-150 cursor-pointer p-3 font-medium"
        >
          CONTACT
        </Link>
      </ul>
    </div>
  );
};

export default Navbar;
