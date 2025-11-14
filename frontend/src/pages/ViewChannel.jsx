import React from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdNotificationsOutline } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { filterAvailableVideos, getThumbnailFallback } from "../utils/videoUtils";

function ViewChannel() {
  const [videos, setVideos] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [channelData, setChannelData] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [sortBy, setSortBy] = useState("Latest");
  const [activeTab, setActiveTab] = useState("Home");
  
  const { channelId } = useParams();
  const userData = JSON.parse(localStorage.getItem("user"));
  const currentUser = useSelector((state) => state.user.user) || userData;
  
  const isOwnChannel = currentUser?.user?.channels?.some(
    (ch) => ch._id === channelId || ch === channelId
  );
  const channelIdToFetch = channelId || userData?.user?.channels[0]?._id;

  const baseURL =
    window.location.hostname === "localhost"
      ? "http://localhost:5001"
      : "https://your-deployment-url.com";

  // Fetch channel data
  useEffect(() => {
    if (!channelIdToFetch) return;
    
    axios
      .get(`${baseURL}/api/channels/${channelIdToFetch}`, {
        withCredentials: true,
      })
      .then((result) => {
        setChannelData(result.data.channel);
      })
      .catch((err) => {
        console.error("Fetch error:", err.response?.data || err.message);
      });
  }, [channelIdToFetch, toggle, baseURL]);

  // Check subscription status
  useEffect(() => {
    if (!channelData || !currentUser?.user) return;
    
    const subscribed = currentUser.user.subscribedChannels?.some(
      (id) => id.toString() === channelData._id.toString()
    );
    setIsSubscribed(subscribed);
  }, [channelData, currentUser]);

      // Fetch channel videos
      useEffect(() => {
        if (!channelIdToFetch) return;
        
        axios
          .get(`${baseURL}/api/videos`, { withCredentials: true })
          .then((result) => {
            const allVideos = result?.data?.allVideos || [];
            const channelVideos = allVideos.filter(
              (video) => {
                const videoChannelId = video?.channelId?._id || video?.channelId;
                return videoChannelId?.toString() === channelIdToFetch.toString();
              }
            );
            // Filter out unavailable videos
            const availableVideos = filterAvailableVideos(channelVideos);
            setVideos(availableVideos);
          })
          .catch((err) => {
            console.error("Fetch error:", err.response?.data || err.message);
          });
      }, [channelIdToFetch, toggle, baseURL]);

  // Sort videos
  const sortedVideos = [...videos].sort((a, b) => {
    if (sortBy === "Latest") {
      return new Date(b.uploadDate) - new Date(a.uploadDate);
    } else if (sortBy === "Oldest") {
      return new Date(a.uploadDate) - new Date(b.uploadDate);
    } else if (sortBy === "Popular") {
      return (b.views || 0) - (a.views || 0);
    }
    return 0;
  });

  // Filter videos based on active tab
  const filteredVideos = activeTab === "Shorts" 
    ? sortedVideos.filter(video => video.isShort === true || video.category === "Shorts")
    : activeTab === "Home" || activeTab === "Videos"
    ? sortedVideos.filter(video => !video.isShort && video.category !== "Shorts")
    : sortedVideos;

  // Handle subscribe
  async function handleSubscribe() {
    if (!currentUser?.user) {
      toast.error("Please login to subscribe");
      return;
    }
    if (!channelData?._id) {
      toast.error("Channel not found");
      return;
    }
    try {
      const response = await axios.post(
        `${baseURL}/api/channels/${channelData._id}/subscribe`,
        {},
        { withCredentials: true }
      );
      setChannelData(response.data.channel);
      setIsSubscribed(response.data.subscribed);
      toast.success(response.data.subscribed ? "Subscribed!" : "Unsubscribed");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to subscribe";
      toast.error(errorMessage);
    }
  }

  function handleDelete(videoId) {
    axios
      .delete(`${baseURL}/api/videos/${videoId}`, {
        withCredentials: true,
      })
      .then((result) => {
        setToggle(!toggle);
        toast.success("Video deleted successfully");
      })
      .catch((err) => {
        console.error("Fetch error:", err.response?.data || err.message);
        toast.error("Failed to delete video");
      });
  }

  // Format date
  function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }

  if (!channelData) {
    return (
      <div className="flex md:mt-17 mt-10 mdd:mt-12">
        <div id="sidebar" className="md:w-[20vw] mdd:w-[20vw] h-[100vh]">
          <Sidebar />
        </div>
        <div id="main" className="mdd:w-[100vw] md:w-[80vw] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Loading Channel...</h2>
          </div>
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
          {/* Channel Banner */}
          <div className="w-full">
            <img
              src={channelData?.channelBanner || "https://via.placeholder.com/1280x360"}
              alt="Channel Banner"
              className="w-full h-[200px] md:h-[250px] object-cover bg-gray-200"
            />
          </div>

          {/* Channel Info Section */}
          <div className="px-4 md:px-6 py-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Channel Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={channelData?.owner?.avatar || userData?.user?.avatar || "https://via.placeholder.com/80"}
                  alt="Channel Avatar"
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover bg-gray-300 border-2 border-white"
                />
              </div>

              {/* Channel Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl md:text-2xl font-bold line-clamp-1">
                    {channelData?.channelName}
                  </h1>
                  <span className="text-gray-500 text-sm">✔</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  @{channelData?.owner?.username || channelData?.owner?.email?.split("@")[0] || "channel"} • {channelData?.subscribers?.toLocaleString() || 0} subscribers • {sortedVideos.length} videos
                </p>
                <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                  {channelData?.description || "No description available"}
                  {channelData?.description && channelData.description.length > 100 && (
                    <button className="text-blue-600 hover:underline ml-1">more</button>
                  )}
                </p>
                {channelData?.owner?.email && (
                  <p className="text-sm text-blue-600 mb-3">
                    {channelData.owner.email} and more links
                  </p>
                )}
                <div className="flex items-center gap-2">
                  {!isOwnChannel && currentUser?.user && (
                    <button
                      onClick={handleSubscribe}
                      className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                        isSubscribed
                          ? "bg-gray-200 hover:bg-gray-300 text-black"
                          : "bg-black hover:bg-gray-800 text-white"
                      }`}
                    >
                      {isSubscribed ? "Subscribed" : "Subscribe"}
                    </button>
                  )}
                  {isOwnChannel && (
                    <Link to={`/updatechannel/${channelData._id}`}>
                      <button className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-full font-medium text-sm transition-colors">
                        Edit Channel
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 px-4 md:px-6">
            <div className="flex items-center gap-6 overflow-x-auto hide-scroll-bar">
              <button
                onClick={() => setActiveTab("Home")}
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === "Home"
                    ? "border-black text-black"
                    : "border-transparent text-gray-600 hover:text-black"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveTab("Videos")}
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === "Videos"
                    ? "border-black text-black"
                    : "border-transparent text-gray-600 hover:text-black"
                }`}
              >
                Videos
              </button>
              <button
                onClick={() => setActiveTab("Shorts")}
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === "Shorts"
                    ? "border-black text-black"
                    : "border-transparent text-gray-600 hover:text-black"
                }`}
              >
                Shorts
              </button>
              <button
                onClick={() => setActiveTab("Live")}
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === "Live"
                    ? "border-black text-black"
                    : "border-transparent text-gray-600 hover:text-black"
                }`}
              >
                Live
              </button>
              <button
                onClick={() => setActiveTab("Playlists")}
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === "Playlists"
                    ? "border-black text-black"
                    : "border-transparent text-gray-600 hover:text-black"
                }`}
              >
                Playlists
              </button>
              <button
                onClick={() => setActiveTab("Community")}
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === "Community"
                    ? "border-black text-black"
                    : "border-transparent text-gray-600 hover:text-black"
                }`}
              >
                Community
              </button>
              <button className="p-2 text-gray-600 hover:text-black">
                <CiSearch className="text-xl" />
              </button>
            </div>
          </div>

          {/* Filter Buttons (only show for Videos tab) */}
          {activeTab === "Videos" && (
            <div className="px-4 md:px-6 py-3 border-b border-gray-200">
              <div className="flex gap-2">
                {["Latest", "Popular", "Oldest"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSortBy(filter)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      sortBy === filter
                        ? "bg-black text-white hover:bg-gray-800"
                        : "bg-gray-100 text-black hover:bg-gray-200"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="px-4 md:px-6 py-6">
            {(activeTab === "Home" || activeTab === "Videos" || activeTab === "Shorts") && (
              <>
                {filteredVideos.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">No {activeTab.toLowerCase()} available</p>
                  </div>
                ) : (
                  <div className={`grid gap-4 ${
                    activeTab === "Shorts" 
                      ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6" 
                      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  }`}>
                    {filteredVideos.map((video) => (
                      <div key={video._id} className="group">
                        <Link to={activeTab === "Shorts" ? `/shorts/${video._id}` : `/video/${video._id}`}>
                          <div className="w-full cursor-pointer">
                            <div className={`relative w-full rounded-lg overflow-hidden mb-2 ${
                              activeTab === "Shorts" ? "aspect-[9/16]" : "aspect-video"
                            }`}>
                              {video.thumbnailUrl ? (
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
                              {activeTab === "Shorts" && (
                                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-0.5 rounded">
                                  SHORTS
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-medium mb-1 text-gray-900 group-hover:text-blue-600 ${
                                activeTab === "Shorts" ? "text-xs line-clamp-2" : "text-sm line-clamp-2"
                              }`}>
                                {video.title}
                              </h3>
                              {activeTab !== "Shorts" && (
                                <>
                                  <p className="text-xs text-gray-600 line-clamp-1 mb-0.5">
                                    {channelData?.channelName || video?.channelId?.channelName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {video.views?.toLocaleString() || 0} views • {formatDate(video.uploadDate)}
                                  </p>
                                </>
                              )}
                              {activeTab === "Shorts" && (
                                <p className="text-xs text-gray-500">
                                  {video.views?.toLocaleString() || 0} views
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                        {isOwnChannel && (
                          <div className="flex gap-3 mt-2">
                            <Link to={`/updatevideo/${video._id}`}>
                              <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm">
                                <FiEdit className="text-sm" /> Edit
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDelete(video._id)}
                              className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
                            >
                              <AiOutlineDelete className="text-sm" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            {activeTab !== "Home" && activeTab !== "Videos" && activeTab !== "Shorts" && (
              <div className="text-center py-12">
                <p className="text-gray-600">{activeTab} content coming soon</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewChannel;
