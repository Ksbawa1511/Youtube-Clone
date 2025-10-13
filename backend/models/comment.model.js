import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },
  text: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export const Comment = mongoose.model("Comment", commentSchema);
