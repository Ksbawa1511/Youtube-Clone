import mongoose from "mongoose";

// Video Schema
const videoSchema = new mongoose.Schema({
  title: { type: String },
  thumbnailUrl: { type: String },
  videoUrl: { type: String },
  description: { type: String },
  category: { type: String },
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
  },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  uploadDate: { type: Date, default: Date.now },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

export const Video = mongoose.model("Video", videoSchema);
