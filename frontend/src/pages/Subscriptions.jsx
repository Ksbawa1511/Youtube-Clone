import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { filterAvailableVideos, getThumbnailFallback } from "../utils/videoUtils";

function Subscriptions() {
  const [videos, setVideos] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const user =
    useSelector((state) => state.user.user) ||
    JSON.parse(localStorage.getItem("user"));

  const baseURL =
    window.location.hostname === "localhost"
      ? "http://localhost:5001"
      : "https://your-deployment-url.com";

  useEffect(() => {
    async function fetchSubscriptions() {
      if (!user?.user) {
        toast.error("Please login to view subscriptions");
        setLoading(false);
        return;
      }

      try {
            const response = await axios.get(`${baseURL}/api/user/subscriptions`, {
              withCredentials: true,
            });
            const allVideos = response.data.videos || [];
            const availableVideos = filterAvailableVideos(allVideos);
            setVideos(availableVideos);
            setChannels(response.data.channels || []);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
        toast.error("Failed to fetch subscriptions");
      } finally {
        setLoading(false);
      }
    }

    fetchSubscriptions();
  }, [user, baseURL]);

  if (!user?.user) {
    return (
      <div className="flex md:mt-17 mt-10 mdd:mt-12">
        <div id="sidebar" className="md:w-[20vw] mdd:w-[20vw] h-[100vh]">
          <Sidebar />
        </div>
        <div id="main" className="mdd:w-[100vw] md:w-[80vw] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Please Login</h2>
            <p className="text-gray-600">You need to be logged in to view your subscriptions.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex md:mt-17 mt-10 mdd:mt-12">
        <div id="sidebar" className="md:w-[20vw] mdd:w-[20vw] h-[100vh]">
          <Sidebar />
        </div>
        <div id="main" className="mdd:w-[100vw] md:w-[80vw] flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex md:mt-17 mt-10 mdd:mt-12">
        <div id="sidebar" className="md:w-[20vw] mdd:w-[20vw] h-[100vh]">
          <Sidebar />
        </div>
        <div id="main" className="mdd:w-[100vw] md:w-[80vw]">
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Subscriptions</h1>
            {channels.length === 0 ? (
              <div className="text-center mt-20">
                <p className="text-gray-600 text-lg">You haven't subscribed to any channels yet.</p>
                <p className="text-gray-500 mt-2">Start subscribing to channels to see their videos here!</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Subscribed Channels ({channels.length})</h2>
                  <div className="flex gap-4 flex-wrap">
                    {channels.map((channel) => (
                      <Link to={`/viewchannel`} key={channel._id}>
                        <div className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-100 cursor-pointer">
                          <img
                            src={channel.channelBanner || "https://via.placeholder.com/150"}
                            alt={channel.channelName}
                            className="w-24 h-24 rounded-full object-cover mb-2"
                          />
                          <h3 className="font-semibold text-center">{channel.channelName}</h3>
                          <p className="text-sm text-gray-500">{channel.subscribers} subscribers</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-3">Latest Videos from Subscriptions</h2>
                  {videos.length === 0 ? (
                    <p className="text-gray-600">No videos from your subscriptions yet.</p>
                  ) : (
                    <div className="flex mb-4 flex-wrap mt-3 mdd:gap-1 mdd:justify-center md:gap-4">
                      {videos.map((video) => (
                        <Link to={`/video/${video?._id}`} key={video?._id}>
                          <div className="md:rounded-xl mdd:rounded-xl md:h-[44vh] mdd:h-[38vh] h-[43vh] shadow-sm xsm:w-[100vw] mdd:w-[49vw] md:w-[323px] bg-amber-10 overflow-hidden">
                            {video?.thumbnailUrl ? (
                              <img
                                className="h-[28vh] w-full object-cover mdd:rounded-xl"
                                src={video.thumbnailUrl}
                                alt="Video Thumbnail"
                                onError={(e) => {
                                  const gradient = getThumbnailFallback(video);
                                  e.target.style.display = 'none';
                                  const fallback = document.createElement('div');
                                  fallback.className = `h-[28vh] w-full bg-gradient-to-br ${gradient} flex items-center justify-center mdd:rounded-xl`;
                                  fallback.innerHTML = '<span class="text-white text-xs font-semibold">Video</span>';
                                  e.target.parentNode.appendChild(fallback);
                                }}
                              />
                            ) : (
                              <div className={`h-[28vh] w-full bg-gradient-to-br ${getThumbnailFallback(video)} flex items-center justify-center mdd:rounded-xl`}>
                                <span className="text-white text-xs font-semibold">Video</span>
                              </div>
                            )}
                            <div className="flex px-2 pt-2 gap-3">
                              {video?.uploader?.avatar ? (
                                <img
                                  className="h-11 w-11 rounded-full object-cover"
                                  src={video.uploader.avatar}
                                  alt="Avatar"
                                  onError={(e) => {
                                    e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(video?.uploader?.username || 'User') + '&background=random';
                                  }}
                                />
                              ) : (
                                <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                                  {(video?.uploader?.username || 'U')[0].toUpperCase()}
                                </div>
                              )}
                              <div className="flex flex-col leading-tight">
                                <h3 className="font-semibold text-base md:text-[17px] leading-tight mb-1 line-clamp-2">
                                  {video?.title}
                                </h3>
                                <p className="text-md text-[#636262] line-clamp-1">
                                  {video?.channelId?.channelName || video?.uploader?.username}
                                </p>
                                <p className="text-sm text-gray-500 line-clamp-1">
                                  {video?.views} views | {video?.uploadDate?.split("T")[0]}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Subscriptions;

