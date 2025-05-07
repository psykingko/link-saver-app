import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import BookmarkViewer from "./pages/BookmarkViewer";
import AddBookmark from "./pages/AddBookmark";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import axios from "axios";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if the theme was already set in localStorage
    const theme = localStorage.getItem("theme");
    if (theme) {
      setIsDarkMode(theme === "dark");
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
    // Whenever the token changes, update axios default header
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, [isAuthenticated]);

  // Handle toggling dark mode state
  const toggleDarkMode = () => {
    console.log("Toggling dark mode:", !isDarkMode ? "Dark" : "Light");
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", !isDarkMode);
  };

  console.log("Is dark mode enabled?", isDarkMode);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-brand-lightBg dark:bg-brand-darkBg transition-colors duration-300">
        <Navbar toggleDarkMode={toggleDarkMode} darkMode={isDarkMode} />
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/home"
            element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/register"
            element={<Register setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/bookmarks"
            element={
              isAuthenticated ? <BookmarkViewer darkMode={isDarkMode} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/add"
            element={
              isAuthenticated ? <AddBookmark darkMode={isDarkMode} /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;