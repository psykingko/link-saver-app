import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const BookmarkViewer = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchBookmarks = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/bookmarks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookmarks(response.data.bookmarks || []);
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err);
        setError("Failed to fetch bookmarks");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchBookmarks();
    } else {
      setLoading(false);
      setError("User not logged in");
    }
  }, [location]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this bookmark?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`${BASE_URL}/api/bookmarks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookmarks(bookmarks.filter((b) => b._id !== id));
    } catch (err) {
      alert("Failed to delete");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (bookmarks.length === 0) return <p>No bookmarks yet.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Bookmarks</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark._id}
            className="bg-white border border-gray-200 rounded-xl shadow-md p-5 flex flex-col hover:shadow-xl transition-shadow"
          >
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-grow"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={bookmark.favicon}
                  alt="favicon"
                  className="w-6 h-6"
                  onError={(e) => {
                    e.target.src = "/default-favicon.png";
                  }}
                />
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {bookmark.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600 line-clamp-4">
                {bookmark.summary}
              </p>
            </a>
            <button
              onClick={() => handleDelete(bookmark._id)}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookmarkViewer;
