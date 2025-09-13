import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo"; // Session store for MongoDB
import authRoutes from "./routes/auth.js";
import connectDB from "./db.js"; // MongoDB connection function
import bookmarkRoutes from "./routes/bookmarkRoutes.js"; // Import bookmark routes

dotenv.config();
const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "http://13.201.18.99",
  "https://link-saver-app-indol.vercel.app/",
  "https://link-saver-kc4cya95j-ashishs-projects-b27772ae.vercel.app/",
];

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Set up session handling
app.use(
  session({
    secret: process.env.SESSION_SECRET, // You can set a custom secret
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI, // MongoDB connection URL
      collectionName: "sessions", // Session collection name
    }),
    cookie: {
      maxAge: 60 * 60 * 1000, // Session expiry (1 hour)
      httpOnly: true, // Makes cookie accessible only by the server
      secure: process.env.NODE_ENV === "production", // Secure cookies in production
    },
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/bookmarks", bookmarkRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
