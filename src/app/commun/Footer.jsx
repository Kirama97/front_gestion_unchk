import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import { IoMdArrowDropright } from "react-icons/io";
import { Link } from "react-router-dom";


const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Logo */}
          <div className="col-span-2">
            <img
              src="/unchk_icon.png"
              alt="Logo"
              className="h-20 mb-4"
            />
            <p className="text-gray-400">
              Plateforme dédiée à la gestion et à la diffusion des informations académiques.
            </p>
          </div>

     

          {/* Réseaux sociaux */}
          <div>
            <h3 className="text-md font-semibold mb-4">
              Suivez-nous
            </h3>

            <div className="flex gap-4 text-2xl mb-4">
              <a href="#">
                <FaFacebook className="hover:text-blue-500 transition" />
              </a>

              <a href="#">
                <FaTwitter className="hover:text-sky-400 transition" />
              </a>

              <a href="#">
                <FaInstagram className="hover:text-pink-500 transition" />
              </a>

              <a href="#">
                <FaLinkedin className="hover:text-blue-600 transition" />
              </a>
            </div>
            
             <Link to="https://www.unchk.sn/"  target="_blank" rel="noopener noreferrer"
              className="text-md mt-4 flex items-center gap-2  text-orange-500 ">
                  <IoMdArrowDropright className="text-orange-500" /> 
                  <p >Site Institutionnel</p>
            </Link>

          </div>
        </div>

        <hr className="border-gray-700 my-6" />

        <div className="text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} .
          Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

