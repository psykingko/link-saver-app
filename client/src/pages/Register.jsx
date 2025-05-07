import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:5000";

function Register({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/register`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.success) {
        setIsAuthenticated(true);
        setTimeout(() => navigate("/home"), 1000);
      }

      console.log("Full response:", res.data);
      setMessage(res.data.message);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Registration failed";
      setMessage(errorMsg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-lightBg dark:bg-brand-darkBg transition-colors duration-300">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-brand-darkCard rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
          Register
        </h2>

        <form onSubmit={handleRegister} className="space-y-5">
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
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-brand-darkAccent2"
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
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-brand-darkAccent2"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-600 dark:bg-brand-darkAccent hover:bg-blue-700 dark:hover:bg-brand-darkAccent2 rounded-lg transition"
          >
            Register
          </button>
        </form>

        <div className="text-center text-sm mt-4 text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 dark:text-brand-darkAccent2 hover:underline"
          >
            Login
          </Link>
        </div>

        {message && (
          <p className="text-sm text-center text-red-600 dark:text-red-400 mt-2">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Register;
