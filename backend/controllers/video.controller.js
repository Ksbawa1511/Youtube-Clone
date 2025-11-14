import { Video } from "../models/video.model.js";

export async function cretevideo(req, res) {
  try {
    const newVideo = await Video.create({ ...req.body, uploader: req.user});
    if (!newVideo) {
      return res.status(400).json({ message: "Something went wrong" });
    }
    return res.status(201).json({ message: "video created", newVideo });
  } catch (error) {
    res.status(500).json({message:"Internal server error",error:error.message})
  }
}


export async function fetchVideos(req, res) {
  try {
    const allVideos = await Video.find().populate("uploader", "username avatar").populate("channelId", "channelName subscribers").populate("comments", "text userId timestamp");
    if(!allVideos){
      return res.status(400).json({message:"Something went wrong"})
    }
    return res.status(200).json({message:"fetch all video successfully",allVideos})
  } catch (error) {
    return res.status(500).json({message:"Internal server error",error:error.message})
  }
}

export async function getVideoStatus(req, res) {
  try {
    const videoId = req.params.videoId;
    const userId = req.user || null; // Optional - can be null if not authenticated
    const { User } = await import("../models/user.model.js");
    
    if (!userId) {
      return res.status(200).json({ liked: false, disliked: false, subscribed: false });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(200).json({ liked: false, disliked: false, subscribed: false });
    }

    const video = await Video.findById(videoId).populate("channelId");
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const liked = user.likedVideos.some(id => id.toString() === videoId);
    const disliked = user.dislikedVideos.some(id => id.toString() === videoId);
    const subscribed = video.channelId && user.subscribedChannels.some(id => id.toString() === video.channelId._id.toString());

    return res.status(200).json({ liked, disliked, subscribed });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

export async function addToHistory(req, res) {
  try {
    const videoId = req.params.videoId;
    const userId = req.user?._id || req.user;
    const { User } = await import("../models/user.model.js");
    
    if (!userId) {
      return res.status(401).json({ message: "Please login to track watch history" });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove existing entry if video already in history (to update timestamp)
    user.watchHistory = user.watchHistory.filter(
      (entry) => entry.video.toString() !== videoId
    );

    // Add to beginning of history (most recent first)
    user.watchHistory.unshift({
      video: videoId,
      watchedAt: new Date(),
    });

    // Keep only last 100 videos in history
    if (user.watchHistory.length > 100) {
      user.watchHistory = user.watchHistory.slice(0, 100);
    }

    await user.save();

    // Increment video views
    video.views = (video.views || 0) + 1;
    await video.save();

    return res.status(200).json({ 
      message: "Video added to watch history", 
      video: video 
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}


export async function updateVideo(req, res) {
  try {
    const videoId = req.params.videoId
    console.log(videoId);
    const updatedVideo = await Video.findByIdAndUpdate(videoId,req.body,{new:true,runValidators:true})
    if(!updatedVideo){
      return res.status(404).json({message:"Vedio not found"})
    }
    return res.status(200).json({message:"video updated successfully",updatedVideo})
  } catch (error) {
    return res.status(500).json({message:"Internal server error",error:error.message})
  }
}


export async function deleteVedio(req, res) {
  try {
    const videoId  = req.params.videoId
    const deletedVedio = await Video.findByIdAndDelete(videoId)
    if(!deleteVedio){
      return res.status(404).json({message:"Vodeo not found"})
    }
    return res.status(200).json({message:"vedio deleted successfully",deletedVedio})
  } catch (error) {
      return res.status(500).json({message:"Internal server error",error:error.message})
  }
}

export async function likeVideo(req, res) {
  try {
    const videoId = req.params.videoId;
    const userId = req.user?._id || req.user;
    const { User } = await import("../models/user.model.js");
    
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user already liked this video
    const alreadyLiked = user.likedVideos.includes(videoId);
    const alreadyDisliked = user.dislikedVideos.includes(videoId);

    if (alreadyLiked) {
      // Unlike: remove from liked, decrease likes
      user.likedVideos = user.likedVideos.filter(id => id.toString() !== videoId);
      video.likes = Math.max(0, video.likes - 1);
      await user.save();
      await video.save();
      return res.status(200).json({ message: "Video unliked", video, liked: false });
    } else {
      // Like: add to liked, remove from disliked if exists, increase likes
      user.likedVideos.push(videoId);
      if (alreadyDisliked) {
        user.dislikedVideos = user.dislikedVideos.filter(id => id.toString() !== videoId);
        video.dislikes = Math.max(0, video.dislikes - 1);
      }
      video.likes = (video.likes || 0) + 1;
      await user.save();
      await video.save();
      return res.status(200).json({ message: "Video liked", video, liked: true });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

export async function dislikeVideo(req, res) {
  try {
    const videoId = req.params.videoId;
    const userId = req.user?._id || req.user;
    const { User } = await import("../models/user.model.js");
    
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user already disliked this video
    const alreadyDisliked = user.dislikedVideos.includes(videoId);
    const alreadyLiked = user.likedVideos.includes(videoId);

    if (alreadyDisliked) {
      // Remove dislike: remove from disliked, decrease dislikes
      user.dislikedVideos = user.dislikedVideos.filter(id => id.toString() !== videoId);
      video.dislikes = Math.max(0, video.dislikes - 1);
      await user.save();
      await video.save();
      return res.status(200).json({ message: "Video undisliked", video, disliked: false });
    } else {
      // Dislike: add to disliked, remove from liked if exists, increase dislikes
      user.dislikedVideos.push(videoId);
      if (alreadyLiked) {
        user.likedVideos = user.likedVideos.filter(id => id.toString() !== videoId);
        video.likes = Math.max(0, video.likes - 1);
      }
      video.dislikes = (video.dislikes || 0) + 1;
      await user.save();
      await video.save();
      return res.status(200).json({ message: "Video disliked", video, disliked: true });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}