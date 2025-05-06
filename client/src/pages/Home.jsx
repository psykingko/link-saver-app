import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import BookmarkList from "../components/BookmarkList";

const Home = () => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const location = useLocation();

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

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("http://localhost:5000/api/bookmarks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setBookmarks(res.data.bookmarks))
        .catch((err) => console.error("Failed to fetch bookmarks:", err));
    } else {
      console.log("Token is missing");
    }
  }, []); // Only run on component mount

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("http://localhost:5000/api/bookmarks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setBookmarks(res.data.bookmarks);
          console.log("API Response:", res.data);
        })

        .catch((err) => console.error("Failed to fetch bookmarks:", err));
    }
  }, [location]); // Refetch when location (route) changes

  const deleteBookmark = (id) => {
    axios
      .delete(`http://localhost:5000/api/bookmarks/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        setBookmarks((prevBookmarks) =>
          prevBookmarks.filter((b) => b._id !== id)
        );
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

      {/* Pass bookmarks and deleteBookmark to BookmarkList */}
      <BookmarkList bookmarks={bookmarks} deleteBookmark={deleteBookmark} />
    </div>
  );
};

export default Home;
