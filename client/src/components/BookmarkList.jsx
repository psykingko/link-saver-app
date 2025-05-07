import { useState, useEffect } from "react";
import axios from "axios";

const BookmarkList = ({ bookmarks, deleteBookmark }) => {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-gray-700 dark:text-white mb-6">
        Your Bookmarks
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {bookmarks.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            No bookmarks yet.
          </p>
        ) : (
          bookmarks.map((bookmark) => (
            <div
              key={bookmark._id}
              className="bg-white dark:bg-brand-darkCard border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-5 flex flex-col hover:shadow-xl transition-shadow"
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
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                    {bookmark.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-4">
                  {bookmark.summary}
                </p>
              </a>
              <button
                onClick={() => {
                  const confirmed = window.confirm(
                    "Are you sure you want to delete this bookmark?"
                  );
                  if (confirmed) deleteBookmark(bookmark._id);
                }}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookmarkList;
