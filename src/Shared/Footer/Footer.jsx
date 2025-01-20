import { FaFacebook, FaLinkedin, FaPhone, FaEnvelope } from "react-icons/fa";
import logo from "../../assets/logo/logo.png";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start border-b border-gray-700 pb-6">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="Website Logo"
                className="h-12 w-12 mr-3"
              />
              <div>
                <h1 className="text-lg md:text-2xl font-bold">Pet Adoption</h1>
                <p className="text-sm text-gray-400">Your Trusted Partner</p>
              </div>
            </Link>
          </div>
          <div className="text-center text-sm md:text-base md:text-left">
            <h3 className="text-lg font-semibold text-gray-200">Contact Us</h3>
            <ul className="space-y-2 mt-4">
              <li className="flex items-center space-x-2">
                <FaPhone className="text-blue-400" />
                <span>+1 (123) 456-7890</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaEnvelope className="text-blue-400" />
                <span>support.petadoption@gmail.com</span>
              </li>
              <li className="flex text-sm md:text-base md:items-center space-x-2">
                <span className="text-gray-400">Address:</span>
                <span>Basundhara, Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
          <div className="mt-6 md:mt-0">
            <h3 className="text-lg font-semibold text-gray-200">Follow Us</h3>
            <div className="flex space-x-4 mt-2">
              <a
                href="https://www.facebook.com/sochin.bhattacharjee.2024"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-400 transition"
              >
                <FaFacebook size={28} />
              </a>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-200 transition"
              >
                <FaLinkedin size={28} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Your Service Mate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
