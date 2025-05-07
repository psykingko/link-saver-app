import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        setIsAuthenticated(true);
        navigate("/");
      } else {
        setError("Token not received from server");
      }
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-lightBg dark:bg-brand-darkBg transition-colors duration-300">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-brand-darkCard rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-brand-darkAccent"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-brand-darkAccent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 dark:bg-brand-darkAccent dark:hover:bg-brand-darkAccent2 transition"
          >
            Login
          </button>
        </form>

        <div className="text-center text-sm mt-4 text-gray-600 dark:text-gray-300">
          New user?{" "}
          <Link
            to="/register"
            className="text-blue-600 dark:text-brand-darkAccent2 hover:underline"
          >
            Register now
          </Link>
        </div>

        {error && (
          <p className="text-sm text-center text-red-600 dark:text-red-400 mt-2">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
