import React, { useState } from "react";
import { Link } from "react-router";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "../../components/Search/Searchbar";
import logo from "../../assets/logo.jpg";

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileSiteActive, setMobileSiteActive] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);

  const dropdownItems = {
    BRAND: [
      { title: "Allopathic", link: "/brands-allophathic" },
      { title: "Herbal", link: "/brands-herbal" },
    ],
    MEDICINE: [
      { title: "Allopathic", link: "/generics-allophathic" },
      { title: "Herbal", link: "/generics-herbal" },
    ],
    MORE: [
      { title: "News", link: "/news" },
      { title: "Doctors Advice", link: "/doctor-advice" },
    ],
  };

  const toggleMobileSideMenu = () => {
    setMobileSiteActive((prev) => !prev);
  };

  const toggleMobileDropdown = (key) => {
    setMobileDropdown((prev) => (prev === key ? null : key));
  };

  return (
    <div className="border-b border-gray-300">
      {/* Top area */}
      <div className="flex justify-between items-center w-full h-20 px-6 md:px-28 relative">
        {/* Logo */}
        <Link to="/" className="text-2xl md:text-3xl font-bold">
          <img src={logo} alt="logo" className="w-50 sm:w-70" />
        </Link>

        {/* Hamburger - mobile only */}
        <div className="block md:hidden">
          <GiHamburgerMenu
            size={24}
            className="cursor-pointer"
            onClick={toggleMobileSideMenu}
          />
        </div>

        {/* MOBILE SIDEBAR */}
        <AnimatePresence>
          {mobileSiteActive && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black z-[1001]"
                onClick={toggleMobileSideMenu}
              />

              {/* Sidebar */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="fixed top-0 left-0 w-[80%] sm:w-[60%] h-full bg-white z-[2000] shadow-lg p-6 flex flex-col"
              >
                {/* Close */}
                <div className="flex justify-end mb-6">
                  <button
                    onClick={toggleMobileSideMenu}
                    className="p-2 bg-gray-200 rounded-full"
                  >
                    <IoClose size={24} />
                  </button>
                </div>

                {/* MOBILE MENU (exact same order as desktop) */}
                <ul className="space-y-4">
                  <Link
                    to="/"
                    onClick={toggleMobileSideMenu}
                    className="block text-sm font-medium"
                  >
                    Home
                  </Link>

                  {/* BRAND */}
                  <li>
                    <div
                      className="flex justify-between items-center cursor-pointer font-medium"
                      onClick={() => toggleMobileDropdown("BRAND")}
                    >
                      Brand <IoIosArrowDown />
                    </div>

                    {mobileDropdown === "BRAND" && (
                      <ul className="pl-4 pt-2 space-y-2">
                        {dropdownItems.BRAND.map((item) => (
                          <li key={item.link}>
                            <Link
                              to={item.link}
                              onClick={toggleMobileSideMenu}
                              className="text-sm text-gray-700"
                            >
                              {item.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>

                  {/* GENERIC */}
                  <li>
                    <div
                      className="flex justify-between items-center cursor-pointer font-medium"
                      onClick={() => toggleMobileDropdown("MEDICINE")}
                    >
                      Generic <IoIosArrowDown />
                    </div>

                    {mobileDropdown === "MEDICINE" && (
                      <ul className="pl-4 pt-2 space-y-2">
                        {dropdownItems.MEDICINE.map((item) => (
                          <li key={item.link}>
                            <Link
                              to={item.link}
                              onClick={toggleMobileSideMenu}
                              className="text-sm text-gray-700"
                            >
                              {item.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>

                  <Link
                    to="/new-product"
                    onClick={toggleMobileSideMenu}
                    className="block text-sm font-medium"
                  >
                    New Product
                  </Link>

                  <Link
                    to="/bioequivalent-drugs"
                    onClick={toggleMobileSideMenu}
                    className="block text-sm font-medium"
                  >
                    Bioequivalent Drug
                  </Link>

                  <Link
                    to="/pharmaceuticals"
                    onClick={toggleMobileSideMenu}
                    className="block text-sm font-medium"
                  >
                    Pharmaceuticals
                  </Link>

                  <Link
                    to="/tests"
                    onClick={toggleMobileSideMenu}
                    className="block text-sm font-medium"
                  >
                    Medical Test
                  </Link>

                  {/* MORE */}
                  <li>
                    <div
                      className="flex justify-between items-center cursor-pointer font-medium"
                      onClick={() => toggleMobileDropdown("MORE")}
                    >
                      More <IoIosArrowDown />
                    </div>

                    {mobileDropdown === "MORE" && (
                      <ul className="pl-4 pt-2 space-y-2">
                        {dropdownItems.MORE.map((item) => (
                          <li key={item.link}>
                            <Link
                              to={item.link}
                              onClick={toggleMobileSideMenu}
                              className="text-sm text-gray-700"
                            >
                              {item.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                </ul>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex items-center relative z-[3000]">
          <Link
            to="/"
            className="text-sm hover:text-secondary hover:underline p-3 font-medium"
          >
            Home
          </Link>

          {/* BRAND */}
          <li
            className="relative"
            onMouseEnter={() => setOpenDropdown("BRAND")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <p className="text-sm font-medium p-3 flex items-center gap-1 cursor-pointer">
              Brand <IoIosArrowDown />
            </p>

            <AnimatePresence>
              {openDropdown === "BRAND" && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute bg-white shadow-lg rounded-md p-2 min-w-[14rem]"
                >
                  {dropdownItems.BRAND.map((i) => (
                    <li key={i.link} className="px-4 py-2 text-sm">
                      <Link to={i.link}>{i.title}</Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </li>

          {/* GENERIC */}
          <li
            className="relative"
            onMouseEnter={() => setOpenDropdown("MEDICINE")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <p className="text-sm font-medium p-3 flex items-center gap-1 cursor-pointer">
              Generic <IoIosArrowDown />
            </p>

            <AnimatePresence>
              {openDropdown === "MEDICINE" && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute bg-white shadow-lg rounded-md p-2 min-w-[14rem]"
                >
                  {dropdownItems.MEDICINE.map((i) => (
                    <li key={i.link} className="px-4 py-2 text-sm">
                      <Link to={i.link}>{i.title}</Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </li>

          <Link
            to="/new-product"
            className="text-sm hover:text-secondary hover:underline p-3 font-medium"
          >
            New Product
          </Link>

          <Link
            to="/bioequivalent-drugs"
            className="text-sm hover:text-secondary hover:underline p-3 font-medium"
          >
            Bioequivalent Drug
          </Link>

          <Link
            to="/pharmaceuticals"
            className="text-sm hover:text-secondary hover:underline p-3 font-medium"
          >
            Pharmaceuticals
          </Link>

          <Link
            to="/tests"
            className="text-sm hover:text-secondary hover:underline p-3 font-medium"
          >
            Medical Test
          </Link>

          {/* MORE */}
          <li
            className="relative"
            onMouseEnter={() => setOpenDropdown("MORE")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <p className="text-sm font-medium p-3 flex items-center gap-1 cursor-pointer">
              More <IoIosArrowDown />
            </p>

            <AnimatePresence>
              {openDropdown === "MORE" && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute bg-white shadow-lg rounded-md p-2 min-w-[14rem]"
                >
                  {dropdownItems.MORE.map((i) => (
                    <li key={i.link} className="px-4 py-2 text-sm">
                      <Link to={i.link}>{i.title}</Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </li>
        </ul>
      </div>

      {/* Search */}
      <div className="w-full">
        <SearchBar />
      </div>
    </div>
  );
};

export default Navbar;
