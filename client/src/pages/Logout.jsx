import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await axios.post(
          `${BASE_URL}/api/auth/logout`,
          {},
          { withCredentials: true }
        );
        localStorage.removeItem("token");
        axios.defaults.headers.common["Authorization"] = null;

        navigate("/login"); // Redirect to login page
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };
    logoutUser();
  }, [navigate]);

  return (
    <div className="container mx-auto p-4 text-center">
      <p>Logging out...</p>
    </div>
  );
};

export default Logout;
