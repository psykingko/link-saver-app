import Bookmark from "../models/Bookmark.js";
import axios from "axios";
import metascraper from "metascraper";
import metascraperTitle from "metascraper-title";
import metascraperDescription from "metascraper-description";

const scraper = metascraper([metascraperTitle(), metascraperDescription()]);

// Helper to normalize URL (strip trailing slashes)
function normalizeUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.origin + parsed.pathname.replace(/\/+$/, "");
  } catch {
    return url;
  }
}

// Extract and fix favicon
const extractFaviconCandidates = (html, baseUrl) => {
  const matches = [
    ...html.matchAll(
      /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/gi
    ),
  ];
  const candidates = matches.map((match) => match[1]);

  const base = new URL(baseUrl);
  const normalize = (href) => {
    if (href.startsWith("//")) return `${base.protocol}${href}`;
    if (href.startsWith("/")) return `${base.origin}${href}`;
    if (!href.startsWith("http")) return `${base.origin}/${href}`;
    return href;
  };

  const allFavicons = [
    ...candidates.map(normalize),
    `${base.origin}/favicon.ico`,
  ];
  return [...new Set(allFavicons)]; // Remove duplicates
};

// Scrape metadata (title, description, favicon)
const getMetaData = async (url) => {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/90.0.4430.212 Safari/537.36",
      },
    });

    const metadata = await scraper({ html, url });
    let faviconCandidates = extractFaviconCandidates(html, url);
    let favicon = "/favicon.ico";

    for (let i = 0; i < Math.min(faviconCandidates.length, 3); i++) {
      try {
        await axios.head(faviconCandidates[i], { timeout: 3000 });
        favicon = faviconCandidates[i];
        break;
      } catch {
        continue;
      }
    }

    return {
      title: metadata.title?.trim() || "No title",
      favicon,
      description: metadata.description?.trim() || "No description",
    };
  } catch (err) {
    console.error(`Metadata fetch failed for ${url}:`, err.message);
    return {
      title: "No title",
      favicon: "/favicon.ico",
      description: "No description",
    };
  }
};

// Fetch summary using Jina AI
const getSummary = async (url) => {
  try {
    const response = await axios.post("https://r.jina.ai/", { url });

    if (response.data?.summary) {
      const raw = response.data.summary;

      // Remove any HTML tags and trim
      let cleaned = raw.replace(/<[^>]*>/g, "").trim();

      // Split into lines and clean each line
      const lines = cleaned
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      // Title is usually first line, summary is next 1-2 lines
      const title = lines[0] || "Untitled";
      const summary = lines.slice(1, 6).join(" ") || "No summary available.";

      return { title, summary };
    }

    return { title: "Untitled", summary: "No summary available." };
  } catch (err) {
    console.error(`Summary fetch failed for ${url}:`, err.message);
    return { title: "Untitled", summary: "No summary available." };
  }
};

// POST /api/bookmarks
export const createBookmark = async (req, res) => {
  let { url, title } = req.body;
  const user = req.user.id;

  url = normalizeUrl(url);

  try {
    const existing = await Bookmark.findOne({ user, url });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Bookmark already exists" });
    }

    const { title: metaTitle, favicon, description } = await getMetaData(url);
    // const summary = await getSummary(url);
    const { title: summaryTitle, summary } = await getSummary(url);

    const newBookmark = new Bookmark({
      title: title || metaTitle,
      favicon,
      summary: summary !== "No summary available." ? summary : description,
      url,
      user,
    });

    await newBookmark.save();
    res.status(201).json({ success: true, bookmark: newBookmark });
  } catch (err) {
    console.error("Error creating bookmark:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to create bookmark" });
  }
};

// GET /api/bookmarks
export const getBookmarks = async (req, res) => {
  const user = req.user.id;

  try {
    const bookmarks = await Bookmark.find({ user }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, bookmarks });
  } catch (err) {
    console.error("Error fetching bookmarks:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch bookmarks" });
  }
};

// DELETE /api/bookmarks/:id
export const deleteBookmark = async (req, res) => {
  const user = req.user.id;
  const { id } = req.params;

  try {
    const bookmark = await Bookmark.findOneAndDelete({ _id: id, user });

    if (!bookmark) {
      return res
        .status(404)
        .json({ success: false, message: "Bookmark not found" });
    }

    res.status(200).json({ success: true, message: "Bookmark deleted" });
  } catch (err) {
    console.error("Error deleting bookmark:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete bookmark" });
  }
};
