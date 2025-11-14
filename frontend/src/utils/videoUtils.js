// Utility function to check if a video is available
export function isVideoAvailable(video) {
  if (!video) return false;
  
  // Check if video has required fields - videoUrl is essential
  if (!video.videoUrl) return false;
  
  // Check if videoUrl is valid (not empty, not just whitespace)
  if (typeof video.videoUrl !== 'string' || video.videoUrl.trim() === '') return false;
  
  // Thumbnail is optional - we can show videos without thumbnails (with gradient fallback)
  // Only filter out if thumbnail URL contains explicit grey placeholder patterns
  if (video.thumbnailUrl) {
    const thumbnailLower = video.thumbnailUrl.toLowerCase();
    // Only filter if it's clearly a placeholder (not YouTube URLs which might contain "default")
    const explicitPlaceholders = [
      'placeholder.com',
      'via.placeholder',
      'gray-placeholder',
      'grey-placeholder',
      'blank-image',
      'missing-image'
    ];
    
    // Don't filter YouTube thumbnails even if they contain "default" (like maxresdefault.jpg)
    if (thumbnailLower.includes('youtube.com') || thumbnailLower.includes('img.youtube.com')) {
      return true; // YouTube thumbnails are valid
    }
    
    // Check for explicit placeholder URLs
    if (explicitPlaceholders.some(placeholder => thumbnailLower.includes(placeholder))) {
      return false;
    }
  }
  
  return true;
}

// Filter available videos
export function filterAvailableVideos(videos) {
  if (!Array.isArray(videos)) return [];
  return videos.filter(video => isVideoAvailable(video));
}

// Get a better thumbnail fallback
export function getThumbnailFallback(video) {
  // Use a colorful gradient based on video category or title
  const categories = {
    'Education': 'from-blue-500 to-cyan-500',
    'Entertainment': 'from-purple-500 to-pink-500',
    'Music': 'from-red-500 to-orange-500',
    'Gaming': 'from-green-500 to-emerald-500',
    'Sports': 'from-yellow-500 to-orange-500',
    'Technology': 'from-indigo-500 to-blue-500',
    'News': 'from-gray-600 to-gray-800',
    'Travel': 'from-teal-500 to-blue-500',
    'Movies': 'from-violet-500 to-purple-500',
    'anime': 'from-pink-500 to-rose-500',
    'series': 'from-amber-500 to-yellow-500',
    'Shorts': 'from-red-600 to-pink-600'
  };
  
  const gradient = categories[video?.category] || 'from-blue-500 to-purple-600';
  return gradient;
}

