import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MoonLoader } from "react-spinners";

const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const AddBookmark = ({ darkMode }) => {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No token found. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${BASE_URL}/api/bookmarks`,
        { url, title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/bookmarks");
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to add bookmark.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-brand-darkBg flex items-center justify-center px-4">
      <div className="bg-white dark:bg-brand-darkCard shadow-xl rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-6 text-center">
          Add New Bookmark
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-brand-darkAccent"
              required
              disabled={loading}
              placeholder="Enter bookmark title"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="url"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              URL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-brand-darkAccent"
              required
              disabled={loading}
              placeholder="https://example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-semibold py-2 rounded-lg transition duration-200 ${
              loading
                ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed"
                : "bg-blue-600 dark:bg-brand-darkAccent text-white hover:bg-blue-700 dark:hover:bg-brand-darkAccent2"
            }`}
          >
            {loading ? "Adding..." : "Add Bookmark"}
          </button>
        </form>

        {loading && (
          <div
            className={`flex justify-center mt-4 ${
              darkMode ? " text-brand-darkText" : ""
            }`}
          >
            <MoonLoader color={darkMode ? "#90E0EF" : "#4B6A84"} size={50} />
          </div>
        )}

        {error && (
          <p className="text-red-600 dark:text-red-400 text-sm mt-4 text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default AddBookmark;
