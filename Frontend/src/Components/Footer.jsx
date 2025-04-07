import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-800 via-indigo-800 to-blue-800 text-white py-8 px-4 text-center shadow-lg">
      <p className="text-sm font-semibold tracking-wide">
        &copy; 2025 <span className="text-yellow-300 font-bold">Lost & Found Hub</span>. All rights reserved.
      </p>

      <div className="mt-4 space-x-6 text-sm">
        <a href="#" className="text-gray-300 hover:text-yellow-300 transition duration-300">Terms</a>
        <a href="#" className="text-gray-300 hover:text-yellow-300 transition duration-300">Privacy Policy</a>
        <a href="#" className="text-gray-300 hover:text-yellow-300 transition duration-300">Support</a>
      </div>

      <div className="mt-5 flex justify-center space-x-6 text-2xl">
        <a href="https://github.com/Nakkkkkul0130" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400 transition duration-300 transform hover:scale-110">
          <FaGithub />
        </a>
        <a href="https://linkedin.com/in/nakul-bhar0130" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-300 transition duration-300 transform hover:scale-110">
          <FaLinkedin />
        </a>
        <a href="https://twitter.com/nakulbhar001" target="_blank" rel="noopener noreferrer" className="text-white hover:text-sky-300 transition duration-300 transform hover:scale-110">
          <FaTwitter />
        </a>
        <a href="https://instagram.com/nakul_bhar0130" target="_blank" rel="noopener noreferrer" className="text-white hover:text-pink-400 transition duration-300 transform hover:scale-110">
          <FaInstagram />
        </a>
      </div>

      <div className="mt-6 text-sm text-gray-100 font-semibold italic">
  Made with <span className="animate-pulse text-lg">🔮</span> & <span className="text-pink-300 font-bold">unicorn dust 🦄</span> by <span className="text-lime-300 font-extrabold">Nakul</span> ✨
</div>

    </footer>
  );
}
