import React, { useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import ListItems from "../components/ListItems";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getThumbnailFallback, filterAvailableVideos } from "../utils/videoUtils";

function Home() {
  //fetch all videos from redux
  const allVideos = useSelector((state) => state.user.userInput || []);
  
  // Filter out videos without valid videoUrl
  const videos = useMemo(() => {
    if (!allVideos || allVideos.length === 0) {
      return [];
    }
    // Filter only videos that completely lack a videoUrl
    const filtered = allVideos.filter(video => {
      return video && video.videoUrl && typeof video.videoUrl === 'string' && video.videoUrl.trim() !== '';
    });
    // If filtering removed all videos, show all videos anyway (might be a filter issue)
    return filtered.length > 0 ? filtered : allVideos;
  }, [allVideos]);

  return (
    <>
      <div className=" flex md:mt-17 mt-10 mdd:mt-12 ">
        <div id="sidebar" className="md:w-[20vw] mdd:w-[20vw] h-[100vh]  ">
          <Sidebar className="" />
        </div>
        <div id="main" className="mdd:w-[100vw] md:w-[80vw]">
          <ListItems />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 py-4">
            {videos && videos.length > 0 ? videos.map((video) => (
              <Link to={`/video/${video?._id}`} key={video?._id} className="group">
                <div className="w-full cursor-pointer">
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-2">
                    {video?.thumbnailUrl ? (
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        src={video.thumbnailUrl}
                        alt="Video Thumbnail"
                        onError={(e) => {
                          const gradient = getThumbnailFallback(video);
                          e.target.style.display = 'none';
                          const fallback = document.createElement('div');
                          fallback.className = `w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`;
                          fallback.innerHTML = '<span class="text-white text-xs font-semibold">Video</span>';
                          e.target.parentNode.appendChild(fallback);
                        }}
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${getThumbnailFallback(video)} flex items-center justify-center`}>
                        <span className="text-white text-xs font-semibold">Video</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3">
                    {video?.uploader?.avatar ? (
                      <img
                        className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
                        src={video.uploader.avatar}
                        alt="Channel Avatar"
                        onError={(e) => {
                          e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(video?.uploader?.username || 'User') + '&background=random';
                        }}
                      />
                    ) : (
                      <div className="h-9 w-9 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                        {(video?.uploader?.username || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm line-clamp-2 mb-1 text-gray-900 group-hover:text-blue-600">
                        {video?.title}
                      </h3>
                      <Link to={`/channel/${video?.channelId?._id || video?.channelId}`}>
                        <p className="text-xs text-gray-600 line-clamp-1 mb-0.5 hover:text-blue-600 cursor-pointer">
                          {video?.channelId?.channelName || video?.uploader?.username}
                        </p>
                      </Link>
                      <p className="text-xs text-gray-500">
                        {video?.views?.toLocaleString() || 0} views • {video?.uploadDate?.split("T")[0] || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 text-lg">No videos available</p>
                <p className="text-gray-500 text-sm mt-2">Videos will appear here once they are added to the database</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
