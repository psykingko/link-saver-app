import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    favicon: { type: String },
    summary: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

bookmarkSchema.index({ user: 1, url: 1 }, { unique: true });

export default mongoose.model("Bookmark", bookmarkSchema);
