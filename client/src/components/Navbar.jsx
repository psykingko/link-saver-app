import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = () => {
    return localStorage.getItem("token") ? true : false;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleLogoClick = () => {
    isAuthenticated() ? navigate("/home") : navigate("/login");
  };

  return (
    <nav className="bg-brand-lightAccent dark:bg-brand-darkCard p-4 shadow-md">
      <div className="flex justify-between items-center container mx-auto">
        <div
          className="text-white text-2xl font-bold cursor-pointer"
          onClick={handleLogoClick}
        >
          Link Saver
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle Slider */}
          <button
            onClick={toggleDarkMode}
            className="relative inline-flex items-center cursor-pointer"
            aria-label="Toggle Dark Mode"
          >
            <div
              className={`w-14 h-8 flex items-center bg-gray-300 dark:bg-gray-700 rounded-full p-1`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transform duration-300 ease-in-out ${
                  darkMode ? "translate-x-6" : "translate-x-0"
                }`}
              ></div>
            </div>
          </button>

          <span className="h-6 w-px bg-gray-400 dark:bg-gray-500 mx-2"></span>

          {isAuthenticated() ? (
            <>
              {location.pathname === "/bookmarks" ? (
                <Link
                  to="/add"
                  className="text-white hover:text-brand-lightAccent2 dark:hover:text-brand-darkAccent2 transition"
                >
                  Add Bookmark
                </Link>
              ) : (
                <Link
                  to="/bookmarks"
                  className="text-white hover:text-brand-lightAccent2 dark:hover:text-brand-darkAccent2 transition"
                >
                  View Bookmarks
                </Link>
              )}

              <span className="h-6 w-px bg-gray-400 dark:bg-gray-500 mx-2"></span>

              <button
                onClick={handleLogout}
                className="text-brand-lightText hover:text-brand-lightAccent2 dark:hover:text-brand-darkAccent2 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {location.pathname !== "/login" && (
                <Link
                  to="/login"
                  className="text-white hover:text-brand-lightAccent2 dark:hover:text-brand-darkAccent2 transition"
                >
                  Login
                </Link>
              )}

              <span className="h-6 w-px bg-gray-400 dark:bg-gray-500 mx-2"></span>

              {location.pathname !== "/register" && (
                <Link
                  to="/register"
                  className="text-white hover:text-brand-lightAccent2 dark:hover:text-brand-darkAccent2 transition"
                >
                  Register
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
