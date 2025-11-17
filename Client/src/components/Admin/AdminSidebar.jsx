import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoMenu,
  IoNewspaperOutline,
  IoFlaskOutline,
  IoAnalyticsOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import {
  MdClose,
  MdHealthAndSafety,
  MdLogout,
  MdLocalPharmacy,
  MdStars,
} from "react-icons/md";
import {
  FaPills,
  FaBullhorn,
  FaUserMd,
  FaUserShield,
  FaIndustry,
} from "react-icons/fa";
import { GiMedicines, GiHospitalCross } from "react-icons/gi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Logout } from "../../lib/APIs/authAPI";

const AdminSidebar = () => {
  const { pathname: currentPath } = useLocation();
  const navigate = useNavigate();
  const { setAuthUser, authUser } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen && !isDesktop ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isOpen, isDesktop]);

  const handleLogout = async () => {
    try {
      await Logout();
      setAuthUser(null);
      navigate("/");
    } catch (error) {
      console.log(error);
      setAuthUser(null);
    }
  };

  // 🟢 Updated icon mapping for each route
  const menuItems = [
    {
      label: "Analytics",
      path: "/admin/dashboard",
      icon: <IoAnalyticsOutline size={22} />,
    },
    {
      label: "News",
      path: "/admin/news",
      icon: <IoNewspaperOutline size={22} />,
    },
    { label: "Brands", path: "/admin/brands", icon: <FaIndustry size={22} /> },
    {
      label: "Generic",
      path: "/admin/generic",
      icon: <GiMedicines size={22} />,
    },
    {
      label: "Medical Test",
      path: "/admin/medical-test",
      icon: <IoFlaskOutline size={22} />,
    },
    {
      label: "Advertisement",
      path: "/admin/advertisement",
      icon: <FaBullhorn size={22} />,
    },
    {
      label: "Doctors Advice",
      path: "/admin/doctors",
      icon: <FaUserMd size={22} />,
    },
    {
      label: "Pharmaceuticals",
      path: "/admin/pharmaceuticals",
      icon: <MdLocalPharmacy size={22} />,
    },
    {
      label: "Trusted Center",
      path: "/admin/trusted-center",
      icon: <FaUserShield size={22} />,
    },
    { label: "Leader", path: "/admin/leaders", icon: <MdStars size={22} /> },
    { label: "Banners", path: "/admin/banners", icon: <MdStars size={22} /> },
  ];

  const sidebarVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 18,
        stiffness: 100,
        when: "beforeChildren",
        staggerChildren: 0.05,
      },
    },
    exit: { x: "-100%", opacity: 0, transition: { when: "afterChildren" } },
  };

  const itemVariants = {
    hidden: { x: -8, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.2 } },
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm fixed top-0 left-0 right-0 z-50">
        <h1 className="text-2xl font-bold text-green-600">eMedsHub</h1>
        <button
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsOpen((s) => !s)}
          className="text-green-600"
        >
          {isOpen ? <MdClose size={28} /> : <IoMenu size={28} />}
        </button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(isOpen || isDesktop) && (
          <motion.aside
            key="sidebar"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`fixed top-0 left-0 h-full min-h-screen overflow-y-auto bg-white border-r border-gray-300 flex flex-col justify-between z-40 shadow-md transition-all 
              ${isDesktop ? "w-[220px]" : "w-[75%] sm:w-[60%]"}`}
          >
            {/* Top section */}
            <div className="pt-8">
              <Link
                to="/"
                onClick={() => !isDesktop && setIsOpen(false)}
                className="flex items-center justify-center mb-10"
              >
                <h1 className="text-2xl font-bold text-green-600">eMedsHub</h1>
              </Link>

              <nav className="flex flex-col space-y-1">
                {menuItems.map(({ label, path, icon }) => (
                  <motion.div key={path} variants={itemVariants}>
                    <Link
                      to={path}
                      onClick={() => !isDesktop && setIsOpen(false)}
                      className={`flex items-center gap-3 px-5 py-3 rounded-r-full transition-all duration-300 ${
                        currentPath === path
                          ? "bg-green-100 text-green-700 font-semibold shadow-sm"
                          : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                      }`}
                    >
                      <span className="text-green-600 flex-shrink-0 w-5 flex justify-center">
                        {icon}
                      </span>
                      <span className="text-[14px]">{label}</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>

            {/* Bottom */}
            <div className="border-t mt-6 py-4 px-5 bg-gray-50">
              <p className="text-sm text-gray-500 mb-2 truncate">
                {authUser?.name || "Admin"}
              </p>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 font-semibold hover:text-red-600 transition-colors"
              >
                <MdLogout size={20} />
                <span>Log Out</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay */}
      {isOpen && !isDesktop && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Page content offset for desktop */}
      {isDesktop && <div className="w-[100px]" />}
    </>
  );
};

export default AdminSidebar;
