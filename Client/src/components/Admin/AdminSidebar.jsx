import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoMenu,
  IoBagHandleOutline,
  IoFlaskOutline,
  IoNewspaperOutline,
  IoBusinessOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import {
  MdClose,
  MdHealthAndSafety,
  MdLocalPharmacy,
  MdLogout,
} from "react-icons/md";
import { GiMedicines } from "react-icons/gi";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { Logout } from "../../lib/APIs/authAPI";

const AdminSidebar = () => {
  const { pathname: currentPath } = useLocation();
  const navigate = useNavigate();
  const { setAuthUser, authUser } = useAuth();

  // mobile open state
  const [isOpen, setIsOpen] = useState(false);
  // desktop detection (avoids reading window in render / SSR mismatches)
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // lock body scroll when sidebar (mobile) is open
  useEffect(() => {
    if (isOpen && !isDesktop) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isDesktop]);

  const handleLogout = async () => {
    try {
      await Logout();
      setAuthUser(null);
      navigate("/");
    } catch (error) {
      setAuthUser(null);
      console.log(error);
    }
  };

  const menuItems = [
    { label: "Analytics", path: "/admin/dashboard", icon: <IoBagHandleOutline size={22} /> },
    { label: "News", path: "/admin/news", icon: <IoNewspaperOutline size={22} /> },
    { label: "Brands", path: "/admin/brands", icon: <IoBusinessOutline size={22} /> },
    { label: "Generic", path: "/admin/generic", icon: <GiMedicines size={22} /> },
    { label: "Medical Test", path: "/admin/medical-test", icon: <IoFlaskOutline size={22} /> },
    { label: "Advertisement", path: "/admin/advertisement", icon: <IoPeopleOutline size={22} /> },
    { label: "Doctors Advice", path: "/admin/doctors", icon: <MdHealthAndSafety size={22} /> },
    { label: "Pharmaceuticals", path: "/admin/pharmaceuticals", icon: <MdLocalPharmacy size={22} /> },
    { label: "Trusted Center", path: "/admin/trusted-center", icon: <MdLocalPharmacy size={22} /> },
  ];

  // Sidebar container animation + stagger for items
  const sidebarVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", damping: 18, stiffness: 100, when: "beforeChildren", staggerChildren: 0.04 },
    },
    exit: { x: "-100%", opacity: 0, transition: { when: "afterChildren" } },
  };

  const itemVariants = {
    hidden: { x: -8, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.18 } },
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b shadow-sm w-full z-50">
        <h1 className="text-2xl font-bold text-green-600">eMedsHub</h1>
        <button
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsOpen((s) => !s)}
        >
          {isOpen ? (
            <MdClose size={28} className="text-green-600" />
          ) : (
            <IoMenu size={28} className="text-green-600" />
          )}
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
            className="fixed top-0 left-0 w-full max-w-[16vw] min-h-screen bg-white border-r border-gray-300 flex flex-col justify-between z-40 shadow-md md:shadow-none"
          >
            {/* Top */}
            <div className="pt-8">
              <Link to="/" className="flex items-center justify-center mb-10" onClick={() => setIsOpen(false)}>
                <h1 className="text-3xl font-bold text-green-600">eMedsHub</h1>
              </Link>

              <nav className="flex flex-col space-y-1 px-0">
                {menuItems.map(({ label, path, icon }) => (
                  <motion.div key={path} variants={itemVariants}>
                    <Link
                      to={path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-4 px-6 py-3 rounded-r-full transition-all duration-300 mx-2 ${
                        currentPath === path
                          ? "bg-green-100 text-green-700 font-semibold shadow-sm"
                          : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                      }`}
                    >
                      <span className="text-green-600 flex-shrink-0" style={{ width: 24, display: "inline-flex", justifyContent: "center" }}>
                        {icon}
                      </span>
                      <span className="text-[15px]">{label}</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>

            {/* Bottom */}
            <div className="border-t mt-6 py-4 px-6 bg-gray-50">
              <p className="text-sm text-gray-500 mb-2 truncate">{authUser?.name || "Admin"}</p>
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

      {/* White overlay for mobile (below sidebar via z-index) */}
      {isOpen && !isDesktop && (
        <div
          className="fixed inset-0 bg-white bg-opacity-60 md:hidden z-30 backdrop-blur-[1px]"
          onClick={() => setIsOpen(false)}
          role="button"
          aria-label="Close menu"
        />
      )}
    </>
  );
};

export default AdminSidebar;
