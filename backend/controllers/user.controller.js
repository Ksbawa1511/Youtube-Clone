import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function userRegister(req, res) {
  try {
    const { username, email, password, avatar, channels } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "username, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      avatar,
      channels,
    });

    return res.status(201).json({
      message: "User registered successfully",
      newUser,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res
      .status(500)
      .json({ message: "User registration failed", error: error.message });
  }
}

export async function userLogin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false, // true in prod
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Required for cross-site cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });


    return res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: "User login failed", error: error.message });
  }
}

export async function fetchUser(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId)
      .select("-password")
      .populate("channels", "channelName description channelBanner videos owner subscribers");

    return res.status(200).json({ message: "Fetch user", user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

export async function updateUaer(req, res) {
  try {
    const userId = req.user.id;
    const channelId = req.params.channelId;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { channels: channelId } }, // avoids duplicates
      { new: true }
    );

    return res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

export function logout(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

export async function getLikedVideos(req, res) {
  try {
    const userId = req.user?._id || req.user;
    const { User } = await import("../models/user.model.js");
    const { Video } = await import("../models/video.model.js");
    
    const user = await User.findById(userId).populate({
      path: "likedVideos",
      populate: [
        { path: "uploader", select: "username avatar" },
        { path: "channelId", select: "channelName subscribers" }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ 
      message: "Liked videos fetched successfully", 
      likedVideos: user.likedVideos || [] 
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

export async function getSubscribedChannels(req, res) {
  try {
    const userId = req.user?._id || req.user;
    const { User } = await import("../models/user.model.js");
    const { Channel } = await import("../models/channel.model.js");
    const { Video } = await import("../models/video.model.js");
    
    const user = await User.findById(userId).populate({
      path: "subscribedChannels",
      populate: {
        path: "videos",
        populate: [
          { path: "uploader", select: "username avatar" },
          { path: "channelId", select: "channelName subscribers" }
        ]
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get all videos from subscribed channels
    const subscribedChannels = user.subscribedChannels || [];
    const allVideos = [];
    
    for (const channel of subscribedChannels) {
      if (channel.videos && channel.videos.length > 0) {
        allVideos.push(...channel.videos);
      }
    }

    // Sort by upload date (newest first)
    allVideos.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

    return res.status(200).json({ 
      message: "Subscribed channels videos fetched successfully", 
      channels: subscribedChannels,
      videos: allVideos
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

export async function getWatchHistory(req, res) {
  try {
    const userId = req.user?._id || req.user;
    const { User } = await import("../models/user.model.js");
    
    if (!userId) {
      return res.status(401).json({ message: "Please login to view watch history" });
    }

    const user = await User.findById(userId).populate({
      path: "watchHistory.video",
      populate: [
        { path: "uploader", select: "username avatar" },
        { path: "channelId", select: "channelName subscribers" }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Sort by watchedAt (most recent first)
    const history = (user.watchHistory || []).sort(
      (a, b) => new Date(b.watchedAt) - new Date(a.watchedAt)
    );

    return res.status(200).json({ 
      message: "Watch history fetched successfully", 
      history: history.map(entry => ({
        video: entry.video,
        watchedAt: entry.watchedAt
      }))
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

export async function clearWatchHistory(req, res) {
  try {
    const userId = req.user?._id || req.user;
    const { User } = await import("../models/user.model.js");
    
    if (!userId) {
      return res.status(401).json({ message: "Please login" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.watchHistory = [];
    await user.save();

    return res.status(200).json({ 
      message: "Watch history cleared successfully"
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
