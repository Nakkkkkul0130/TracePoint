import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", id: "home", type: "scroll" },
    { name: "About", path: "/about", type: "link" },
    { name: "Statistics", id: "statistics", type: "scroll" },
    { name: "Contact", id: "contact", type: "scroll" },
    { name: "Testimonials", id: "testimonials", type: "scroll" },
  ];

  const authLinks = [
    {
      path: "/login",
      label: "Login",
      styles: "bg-white text-blue-600 hover:bg-blue-500 hover:text-white",
    },
    {
      path: "/signup",
      label: "Sign Up",
      styles: "bg-green-500 text-white hover:bg-green-600",
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
      <nav className="fixed top-0 left-0 w-full bg-blue-500 text-white shadow-md p-4 flex justify-between items-center z-50">
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={() => handleScroll("home")}
        >
          Trace Point
        </h1>

        <div className="hidden md:flex space-x-5">
          {navItems.map(({ name, id, path, type }) =>
            type === "scroll" ? (
              <button
                key={name}
                onClick={() => handleScroll(id)}
                className="text-lg hover:text-gray-200"
              >
                {name}
              </button>
            ) : (
              <Link
                key={name}
                to={path}
                className="text-lg hover:text-gray-200"
              >
                {name}
              </Link>
            )
          )}
        </div>

        <div className="hidden md:flex space-x-4">
          {authLinks.map(({ path, label, styles }) => (
            <Link
              key={path}
              to={path}
              className={`px-5 py-2 rounded-md shadow-md transition ${styles}`}
            >
              {label}
            </Link>
          ))}
        </div>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {menuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white text-gray-800 shadow-lg p-4 flex flex-col items-center space-y-4 md:hidden">
            {navItems.map(({ name, id, path, type }) =>
              type === "scroll" ? (
                <button
                  key={name}
                  onClick={() => handleScroll(id)}
                  className="text-lg hover:text-blue-500"
                >
                  {name}
                </button>
              ) : (
                <Link
                  key={name}
                  to={path}
                  className="text-lg hover:text-blue-500"
                  onClick={() => setMenuOpen(false)}
                >
                  {name}
                </Link>
              )
            )}
            {authLinks.map(({ path, label, styles }) => (
              <Link
                key={path}
                to={path}
                className={`w-full text-center px-4 py-2 rounded-md transition ${styles}`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <div className="w-full bg-yellow-400 text-black py-1 mb-9 overflow-hidden">
        <div className="animate-marquee text-lg font-semibold">
          🚀 Special Offer: Report lost items for free this month! | 📢 New
          feature: QR Code Tagging for lost & found items! | 🔥 Join our
          community today!
        </div>
      </div>
    </>
  );
}
