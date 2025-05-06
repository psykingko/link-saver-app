import axios from "axios";

export const fetchSummary = async (url) => {
  try {
    const response = await axios.post("https://r.jina.ai/", { url });

    if (response.data && response.data.summary) {
      // Truncate to 3-4 lines (~400-500 chars)
      return response.data.summary.slice(0, 500);
    }

    return "No summary available.";
  } catch (error) {
    console.error("Error fetching summary from Jina AI:", error.message);
    return "Failed to fetch summary.";
  }
};
