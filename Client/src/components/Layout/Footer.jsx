import { IoMdArrowRoundUp } from "react-icons/io";
import { Link } from "react-router";
import { PiCopyright } from "react-icons/pi";
import { CiMobile1 } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";

const Footer = () => {
  return (
    <div className="w-full md:h-20 flex flex-col gap-10 items-center px-6 py-4 md:px-28 relative mt-20">
      {/* <div
        className="p-2 rounded-full bg-tertiary hover:bg-secondary transition-all duration-200 cursor-pointer absolute bottom-5 right-5 md:right-10 md:bottom-15"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <IoMdArrowRoundUp className="text-white" size={24} />
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 w-full border-b border-gray-300 pb-10">
        <div className="text-xl font-bold">eMedsHub</div>
        <div>
          <h1 className="text-gray-500 font-semibold mb-4">ABOUT</h1>
          <ul className="text-sm flex flex-col gap-2">
            <Link to="/about-us">About us</Link>
            <li>Blog</li>
            <li>FAQ</li>
            <li>Login</li>
            <li>Register</li>
          </ul>
        </div>
        <div>
          <h1 className="text-gray-500 font-semibold mb-4">USEFUL LINKS</h1>
          <ul className="text-sm flex flex-col gap-2">
            <li>Doctors</li>
            <li>Clinic</li>
            <li>Specialization</li>
            <li>Join as a doctor</li>
            <li>Download App</li>
          </ul>
        </div>
        <div>
          <h1 className="text-gray-500 font-semibold mb-4">CONTACT WITH US</h1>
          <ul className="text-sm flex flex-col gap-2">
            <li className="flex items-center gap-1">
              <span>
                <CiMobile1 size={18} />
              </span>{" "}
              <span>+ 61 23 8093 3400</span>
            </li>
            <li className="flex items-center gap-1">
              <span>
                <MdOutlineEmail size={18} />
              </span>{" "}
              <span>help@emedshub.com</span>
            </li>
            <h1 className="text-gray-500 font-semibold my-4">FOLLOW US</h1>
            <li></li>
          </ul>
        </div>
      </div>
      <div className="flex items-center justify-between w-full text-sm text-gray-400 py-10">
        <div>
          <Link>Terms and Conditions</Link> | <Link>Privacy</Link>
        </div>
        <div className="flex items-center gap-1">
          <PiCopyright size={18} /> eMedsHubs
        </div>
      </div>
    </div>
  );
};

export default Footer;
