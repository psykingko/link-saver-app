import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import BookmarkList from "../components/BookmarkList";
import { MoonLoader } from "react-spinners";

const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const Home = () => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fetchBookmarks = () => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${BASE_URL}/api/bookmarks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setBookmarks(res.data.bookmarks);
        })
        .catch((err) => console.error("Failed to fetch bookmarks:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      console.log("Token is missing");
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  useEffect(() => {
    fetchBookmarks();
  }, [location]);

  const handleAddBookmark = () => {
    if (localStorage.getItem("token")) {
      navigate("/add");
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const deleteBookmark = (id) => {
    axios
      .delete(`${BASE_URL}/api/bookmarks/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        setBookmarks((prev) => prev.filter((b) => b._id !== id));
        console.log("Bookmark deleted successfully");
      })
      .catch((err) => console.error("Error deleting bookmark:", err));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to Link Saver!
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleAddBookmark}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg"
          >
            Add Bookmark
          </button>
          <button
            onClick={handleLogout}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center mt-4">
          <MoonLoader color="#4B6A84" size={50} />
        </div>
      ) : bookmarks.length === 0 ? (
        <p className="text-center text-gray-600">No bookmarks yet.</p>
      ) : (
        <BookmarkList bookmarks={bookmarks} deleteBookmark={deleteBookmark} />
      )}
    </div>
  );
};

export default Home;
