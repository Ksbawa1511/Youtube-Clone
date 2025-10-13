# YouTube API Integration Setup

## 🚀 **Quick Setup Guide**

### **Step 1: Get YouTube API Key**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **YouTube Data API v3**
4. Go to **APIs & Services** → **Credentials**
5. Click **Create Credentials** → **API Key**
6. Copy your API key

### **Step 2: Add API Key to Environment**
Add this line to your `backend/.env` file:
```
YOUTUBE_API_KEY=your_actual_api_key_here
```

### **Step 3: Install Dependencies**
```bash
cd backend
npm install axios
```

### **Step 4: Run the Sync Script**
```bash
node syncYouTubeVideos.js
```

## 📋 **What the Integration Does**

✅ **Fetches Videos**: Gets all videos from your YouTube channel  
✅ **Creates Channel**: Automatically creates a channel in your database  
✅ **Adds Videos**: Imports all videos with real metadata  
✅ **Real Data**: Uses actual views, likes, thumbnails, descriptions  
✅ **Duplicate Prevention**: Skips videos that already exist  

## 🎯 **Features**

- **Automatic Channel Creation**: Creates your channel if it doesn't exist
- **Real YouTube Data**: Fetches actual video statistics and metadata
- **Embed URLs**: Generates proper YouTube embed URLs for playback
- **Thumbnails**: Uses high-quality thumbnails from YouTube
- **Categories**: Automatically categorizes videos (default: Technology)

## 🔧 **Customization**

You can modify the sync script to:
- Change the default category
- Add custom tags
- Filter videos by date
- Limit the number of videos imported
- Add custom channel description

## ⚠️ **Important Notes**

- **API Quotas**: YouTube API has daily limits (10,000 units/day)
- **Rate Limits**: Don't run the script too frequently
- **Channel Username**: Currently set to 'kaushalsingh740' - change in sync script if needed

## 🎬 **Result**

After running the sync, you'll have:
- Your actual YouTube channel in the database
- All your real videos with proper metadata
- Working embed URLs for video playback
- Real thumbnails and descriptions
- Actual view counts and engagement data

**Your YouTube clone will now display your real channel content!** 🎉
