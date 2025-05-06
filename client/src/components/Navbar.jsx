import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = () => {
    return localStorage.getItem("token") ? true : false;
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/login"); // Redirect to login page after logout
  };

  const handleLogoClick = () => {
    if (isAuthenticated()) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="flex justify-between items-center container mx-auto">
        <div
          className="text-white text-2xl font-bold cursor-pointer"
          onClick={handleLogoClick}
        >
          Link Saver
        </div>
        <div className="space-x-4">
          {isAuthenticated() ? (
            <>
              {location.pathname === "/bookmarks" ? (
                <Link to="/add" className="text-white hover:text-gray-300">
                  Add Bookmark
                </Link>
              ) : (
                <Link
                  to="/bookmarks"
                  className="text-white hover:text-gray-300"
                >
                  View Bookmarks
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-white hover:text-gray-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {location.pathname !== "/login" && (
                <Link to="/login" className="text-white hover:text-gray-300">
                  Login
                </Link>
              )}
              {location.pathname !== "/register" && (
                <Link to="/register" className="text-white hover:text-gray-300">
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
