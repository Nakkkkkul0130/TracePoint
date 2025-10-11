import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Report Lost", path: "/report-lost" },
    { name: "View Found", path: "/view-found" },
    { name: "About", path: "/about" }
  ];

  const socialLinks = [
    { icon: FaGithub, url: "https://github.com/Nakkkkkul0130", color: "hover:text-gray-300" },
    { icon: FaLinkedin, url: "https://linkedin.com/in/nakul-bhar0130", color: "hover:text-blue-400" },
    { icon: FaTwitter, url: "https://twitter.com/nakulbhar001", color: "hover:text-sky-400" },
    { icon: FaInstagram, url: "https://instagram.com/nakul_bhar0130", color: "hover:text-pink-400" }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                🔍
              </div>
              <h3 className="text-2xl font-bold gradient-text">TracePoint</h3>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Connecting communities to reunite people with their lost belongings. 
              Join thousands of users who trust TracePoint to help find what matters most.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, url, color }, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white ${color} transition-all duration-300 hover:bg-white/20 hover:scale-110`}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map(({ name, path }) => (
                <li key={name}>
                  <Link
                    to={path}
                    className="text-gray-300 hover:text-white transition-colors duration-300 hover:underline"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#contact" className="text-gray-300 hover:text-white transition-colors duration-300 hover:underline">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 hover:underline">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 hover:underline">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-300 text-sm">
              © 2025 <span className="font-semibold text-white">TracePoint</span>. All rights reserved.
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <span>Made with</span>
              <span className="text-red-500 animate-pulse">❤️</span>
              <span>by</span>
              <span className="font-bold gradient-text">Nakul Bhar</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
