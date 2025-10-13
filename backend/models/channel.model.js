import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
  channelName: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  description: String,
  channelBanner: String,
  subscribers: { type: Number, default: 0 },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
});

export const Channel = mongoose.model("Channel", channelSchema);
