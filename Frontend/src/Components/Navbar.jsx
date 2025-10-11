import { useState, useEffect } from "react";
import { Menu, X, Search, Bell } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: "Home", id: "home", type: "scroll", icon: "🏠" },
    { name: "About", path: "/about", type: "link", icon: "ℹ️" },
    { name: "Statistics", id: "statistics", type: "scroll", icon: "📊" },
    { name: "Contact", id: "contact", type: "scroll", icon: "📞" },
    { name: "Testimonials", id: "testimonials", type: "scroll", icon: "💬" },
  ];

  const authLinks = [
    {
      path: "/login",
      label: "Login",
      styles: "glass text-white hover:bg-white/30",
    },
    {
      path: "/signup",
      label: "Get Started",
      styles: "btn-primary",
    },
  ];

  const handleScroll = (id) => {
    setMenuOpen(false);

    const scrollToSection = () => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(scrollToSection, 100);
    } else {
      scrollToSection();
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg' 
          : 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div 
              className="flex items-center space-x-2 cursor-pointer group"
              onClick={() => handleScroll("home")}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg animate-float">
                🔍
              </div>
              <h1 className={`text-2xl font-bold transition-colors ${
                scrolled ? 'text-gray-900 dark:text-white' : 'text-white'
              } group-hover:gradient-text`}>
                TracePoint
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map(({ name, id, path, type, icon }) =>
                type === "scroll" ? (
                  <button
                    key={name}
                    onClick={() => handleScroll(id)}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                      scrolled 
                        ? 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20' 
                        : 'text-white/90 hover:text-white hover:bg-white/20'
                    }`}
                  >
                    <span>{icon}</span>
                    <span>{name}</span>
                  </button>
                ) : (
                  <Link
                    key={name}
                    to={path}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                      scrolled 
                        ? 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20' 
                        : 'text-white/90 hover:text-white hover:bg-white/20'
                    }`}
                  >
                    <span>{icon}</span>
                    <span>{name}</span>
                  </Link>
                )
              )}
            </div>

            {/* Auth Links */}
            <div className="hidden md:flex items-center space-x-4">
              {authLinks.map(({ path, label, styles }) => (
                <Link
                  key={path}
                  to={path}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${styles}`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Mobile menu button */}
            <button 
              className={`md:hidden p-2 rounded-lg transition-colors ${
                scrolled ? 'text-gray-700 dark:text-gray-300' : 'text-white'
              }`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 py-6 space-y-4">
              {navItems.map(({ name, id, path, type, icon }) =>
                type === "scroll" ? (
                  <button
                    key={name}
                    onClick={() => handleScroll(id)}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                  >
                    <span className="text-xl">{icon}</span>
                    <span className="font-medium">{name}</span>
                  </button>
                ) : (
                  <Link
                    key={name}
                    to={path}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="text-xl">{icon}</span>
                    <span className="font-medium">{name}</span>
                  </Link>
                )
              )}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                {authLinks.map(({ path, label, styles }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`block w-full text-center px-4 py-3 rounded-xl font-medium transition-all ${styles}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Announcement Banner */}
      <div className="w-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white py-2 mt-16 overflow-hidden">
        <div className="animate-marquee text-sm font-semibold flex items-center space-x-8">
          <span>🚀 Special Offer: Report lost items for free this month!</span>
          <span>📢 New feature: QR Code Tagging for lost & found items!</span>
          <span>🔥 Join our community today and help reunite people with their belongings!</span>
          <span>✨ Over 1000+ items successfully returned to their owners!</span>
        </div>
      </div>
    </>
  );
}
