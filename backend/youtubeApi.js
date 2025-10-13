import axios from 'axios';

class YouTubeAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://www.googleapis.com/youtube/v3';
  }

  // Get channel ID from username
  async getChannelId(username) {
    try {
      const response = await axios.get(`${this.baseURL}/channels`, {
        params: {
          part: 'id',
          forHandle: `@${username}`, // Use forHandle for channel handles
          key: this.apiKey
        }
      });

      if (response.data.items && response.data.items.length > 0) {
        return response.data.items[0].id;
      }
      return null;
    } catch (error) {
      console.error('Error getting channel ID:', error.response?.data || error.message);
      return null;
    }
  }

  // Get channel videos
  async getChannelVideos(channelId, maxResults = 50) {
    try {
      const response = await axios.get(`${this.baseURL}/search`, {
        params: {
          part: 'snippet',
          channelId: channelId,
          type: 'video',
          order: 'date',
          maxResults: maxResults,
          key: this.apiKey
        }
      });

      return response.data.items || [];
    } catch (error) {
      console.error('Error getting channel videos:', error.response?.data || error.message);
      return [];
    }
  }

  // Get video details
  async getVideoDetails(videoId) {
    try {
      const response = await axios.get(`${this.baseURL}/videos`, {
        params: {
          part: 'snippet,statistics,contentDetails',
          id: videoId,
          key: this.apiKey
        }
      });

      if (response.data.items && response.data.items.length > 0) {
        return response.data.items[0];
      }
      return null;
    } catch (error) {
      console.error('Error getting video details:', error.response?.data || error.message);
      return null;
    }
  }

  // Get channel videos by channel ID
  async getChannelVideosById(channelId, maxResults = 50) {
    try {
      // Step 1: Get video list
      const videos = await this.getChannelVideos(channelId, maxResults);
      
      if (videos.length === 0) {
        return {
          channelId,
          channelTitle: 'Unknown Channel',
          videos: []
        };
      }

      // Step 2: Get detailed information for each video
      const videoIds = videos.map(video => video.id.videoId).join(',');
      const videoDetailsResponse = await this.getVideoDetails(videoIds);
      const videoDetails = Array.isArray(videoDetailsResponse) ? videoDetailsResponse : [videoDetailsResponse];

      // Step 3: Combine data
      const detailedVideos = videos.map(video => {
        const details = videoDetails.find(detail => detail && detail.id === video.id.videoId);
        return {
          videoId: video.id.videoId,
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnailUrl: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high?.url,
          channelTitle: video.snippet.channelTitle,
          publishedAt: video.snippet.publishedAt,
          videoUrl: `https://www.youtube.com/embed/${video.id.videoId}`,
          views: details?.statistics?.viewCount || '0',
          likes: details?.statistics?.likeCount || '0',
          duration: details?.contentDetails?.duration || 'PT0S'
        };
      });

      return {
        channelId,
        channelTitle: videos[0]?.snippet?.channelTitle || 'Unknown Channel',
        videos: detailedVideos
      };
    } catch (error) {
      console.error('Error getting channel videos by ID:', error.message);
      throw error;
    }
  }

  // Get all videos with full details
  async getAllChannelVideos(username, maxResults = 50) {
    try {
      // Step 1: Get channel ID
      const channelId = await this.getChannelId(username);
      if (!channelId) {
        throw new Error(`Channel not found for username: ${username}`);
      }

      // Step 2: Get video list
      const videos = await this.getChannelVideos(channelId, maxResults);
      
      // Step 3: Get detailed information for each video
      const videoIds = videos.map(video => video.id.videoId).join(',');
      const videoDetailsResponse = await this.getVideoDetails(videoIds);
      const videoDetails = Array.isArray(videoDetailsResponse) ? videoDetailsResponse : [videoDetailsResponse];

      // Step 4: Combine data
      const detailedVideos = videos.map(video => {
        const details = videoDetails.find(detail => detail && detail.id === video.id.videoId);
        return {
          videoId: video.id.videoId,
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnailUrl: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high?.url,
          channelTitle: video.snippet.channelTitle,
          publishedAt: video.snippet.publishedAt,
          videoUrl: `https://www.youtube.com/embed/${video.id.videoId}`,
          views: details?.statistics?.viewCount || '0',
          likes: details?.statistics?.likeCount || '0',
          duration: details?.contentDetails?.duration || 'PT0S'
        };
      });

      return {
        channelId,
        channelTitle: videos[0]?.snippet?.channelTitle || username,
        videos: detailedVideos
      };
    } catch (error) {
      console.error('Error getting all channel videos:', error.message);
      throw error;
    }
  }
}

export default YouTubeAPI;
