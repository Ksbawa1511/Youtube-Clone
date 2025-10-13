import dotenv from "dotenv";
import YouTubeAPI from "./youtubeApi.js";

dotenv.config();

async function testYouTubeAPI() {
  try {
    if (!process.env.YOUTUBE_API_KEY) {
      console.log("❌ Please add your YouTube API key to the .env file");
      console.log("Add this line to backend/.env:");
      console.log("YOUTUBE_API_KEY=your_actual_api_key_here");
      return;
    }

    console.log("🔍 Testing YouTube API connection...");
    
    const youtubeAPI = new YouTubeAPI(process.env.YOUTUBE_API_KEY);
    
    // Test getting channel ID
    console.log("📺 Getting channel ID for kaushalsingh740...");
    const channelId = await youtubeAPI.getChannelId('kaushalsingh740');
    
    if (channelId) {
      console.log(`✅ Channel ID found: ${channelId}`);
      
      // Test getting videos
      console.log("🎬 Getting channel videos...");
      const videos = await youtubeAPI.getChannelVideos(channelId, 5);
      
      if (videos.length > 0) {
        console.log(`✅ Found ${videos.length} videos:`);
        videos.forEach((video, index) => {
          console.log(`   ${index + 1}. ${video.snippet.title}`);
        });
        
        console.log("\n🎉 API test successful! Ready to sync videos.");
        console.log("Run: node syncYouTubeVideos.js");
      } else {
        console.log("❌ No videos found in the channel");
      }
    } else {
      console.log("❌ Channel not found. Please check the username: kaushalsingh740");
    }
    
  } catch (error) {
    console.error("❌ API test failed:", error.message);
    
    if (error.message.includes('API key')) {
      console.log("\n💡 Make sure to:");
      console.log("1. Get your API key from Google Cloud Console");
      console.log("2. Add it to backend/.env file");
      console.log("3. Enable YouTube Data API v3 in your project");
    }
  }
}

testYouTubeAPI();
