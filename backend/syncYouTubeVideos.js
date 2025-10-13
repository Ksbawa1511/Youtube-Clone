import mongoose from "mongoose";
import dotenv from "dotenv";
import YouTubeAPI from "./youtubeApi.js";

dotenv.config();

// Import models
import { User } from "./models/user.model.js";
import { Channel } from "./models/channel.model.js";
import { Video } from "./models/video.model.js";

async function syncYouTubeVideos() {
  try {
    // Check if API key is provided
    if (!process.env.YOUTUBE_API_KEY) {
      console.error("❌ YouTube API key not found!");
      console.log("Please add YOUTUBE_API_KEY to your .env file");
      return;
    }

    // Connect to MongoDB
    await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`);
    console.log("✅ Connected to MongoDB");

    // Initialize YouTube API
    const youtubeAPI = new YouTubeAPI(process.env.YOUTUBE_API_KEY);

    // Get channel videos
    console.log("🔍 Fetching videos from YouTube channel...");
    const channelData = await youtubeAPI.getAllChannelVideos('kaushalsingh740', 20);

    if (!channelData || !channelData.videos || channelData.videos.length === 0) {
      console.log("❌ No videos found for the channel");
      return;
    }

    console.log(`📺 Found ${channelData.videos.length} videos from channel: ${channelData.channelTitle}`);

    // Get or create user
    let user = await User.findOne({ username: 'kaushal_singh' });
    if (!user) {
      user = new User({
        username: 'kaushal_singh',
        email: 'kaushal@example.com',
        password: 'hashed_password_here', // You should hash this properly
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      });
      await user.save();
      console.log("✅ Created user: kaushal_singh");
    }

    // Get or create channel
    let channel = await Channel.findOne({ channelName: channelData.channelTitle });
    if (!channel) {
      channel = new Channel({
        channelName: channelData.channelTitle,
        description: `Official YouTube channel of ${channelData.channelTitle}`,
        channelBanner: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=300&fit=crop',
        subscribers: 1000, // You can update this with real data
        owner: user._id,
        videos: []
      });
      await channel.save();
      console.log(`✅ Created channel: ${channelData.channelTitle}`);
    }

    // Add videos to database
    let addedCount = 0;
    let skippedCount = 0;

    for (const videoData of channelData.videos) {
      // Check if video already exists
      const existingVideo = await Video.findOne({ videoUrl: videoData.videoUrl });
      if (existingVideo) {
        console.log(`⏭️  Skipped existing video: ${videoData.title}`);
        skippedCount++;
        continue;
      }

      // Create new video
      const video = new Video({
        title: videoData.title,
        description: videoData.description,
        videoUrl: videoData.videoUrl,
        thumbnailUrl: videoData.thumbnailUrl,
        duration: videoData.duration,
        views: parseInt(videoData.views) || 0,
        likes: parseInt(videoData.likes) || 0,
        dislikes: 0, // YouTube API v3 doesn't provide dislikes
        category: 'Technology', // Default category, you can categorize based on title/description
        tags: [], // You can extract tags from description if needed
        uploader: user._id,
        channelId: channel._id,
        uploadDate: new Date(videoData.publishedAt)
      });

      await video.save();
      
      // Add video to channel
      channel.videos.push(video._id);
      
      console.log(`✅ Added video: ${videoData.title}`);
      addedCount++;
    }

    // Update channel with new videos
    await channel.save();

    console.log("\n🎉 YouTube sync completed!");
    console.log(`📊 Summary:`);
    console.log(`   - Videos added: ${addedCount}`);
    console.log(`   - Videos skipped: ${skippedCount}`);
    console.log(`   - Total videos in channel: ${channel.videos.length}`);

  } catch (error) {
    console.error("❌ Error syncing YouTube videos:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Run the sync
syncYouTubeVideos();
