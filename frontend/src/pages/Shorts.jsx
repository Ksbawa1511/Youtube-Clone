import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { AiOutlineDislike, AiFillDislike } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { FaShare } from "react-icons/fa";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";

function Shorts() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [currentVideo, setCurrentVideo] = useState(null);
  const [allShorts, setAllShorts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [videoLikes, setVideoLikes] = useState(0);
  const [videoDislikes, setVideoDislikes] = useState(0);

  const user =
    useSelector((state) => state.user.user) ||
    JSON.parse(localStorage.getItem("user"));

  const baseURL =
    window.location.hostname === "localhost"
      ? "http://localhost:5001"
      : "https://your-deployment-url.com";

  // Fetch all shorts
  useEffect(() => {
    axios
      .get(`${baseURL}/api/videos`, { withCredentials: true })
      .then((result) => {
        const shorts = (result?.data?.allVideos || []).filter(
          (video) => video.isShort === true || video.category === "Shorts"
        );
        console.log("Shorts found:", shorts.length);
        setAllShorts(shorts);
        
        // Find current video index
        if (videoId) {
          const index = shorts.findIndex((v) => v._id === videoId);
          if (index !== -1) {
            setCurrentIndex(index);
            setCurrentVideo(shorts[index]);
          } else if (shorts.length > 0) {
            setCurrentIndex(0);
            setCurrentVideo(shorts[0]);
            navigate(`/shorts/${shorts[0]._id}`, { replace: true });
          }
        } else if (shorts.length > 0) {
          setCurrentIndex(0);
          setCurrentVideo(shorts[0]);
          navigate(`/shorts/${shorts[0]._id}`, { replace: true });
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err.response?.data || err.message);
      });
  }, [videoId, baseURL, navigate]);

  // Update current video when index changes
  useEffect(() => {
    if (allShorts.length > 0 && allShorts[currentIndex]) {
      const video = allShorts[currentIndex];
      setCurrentVideo(video);
      navigate(`/shorts/${video._id}`, { replace: true });
      fetchVideoStatus(video._id);
    }
  }, [currentIndex, allShorts, navigate]);

  // Fetch video status (liked/disliked)
  async function fetchVideoStatus(vidId) {
    if (!user?.user) return;
    
    try {
      const response = await axios.get(`${baseURL}/api/videos/${vidId}/status`, {
        withCredentials: true,
      });
      setIsLiked(response.data.liked || false);
      setIsDisliked(response.data.disliked || false);
    } catch (error) {
      // Silently fail
    }
  }

  // Fetch current video details
  useEffect(() => {
    if (currentVideo) {
      setVideoLikes(currentVideo.likes || 0);
      setVideoDislikes(currentVideo.dislikes || 0);
      fetchVideoStatus(currentVideo._id);
    }
  }, [currentVideo, user, baseURL]);

  // Handle scroll for next/previous short
  const handleWheel = (e) => {
    if (Math.abs(e.deltaY) > 50) {
      if (e.deltaY > 0 && currentIndex < allShorts.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  // Handle like
  async function handleLike() {
    if (!user?.user) {
      toast.error("Please login to like");
      return;
    }
    try {
      const response = await axios.post(
        `${baseURL}/api/videos/${currentVideo._id}/like`,
        {},
        { withCredentials: true }
      );
      setVideoLikes(response.data.video.likes);
      setIsLiked(response.data.liked);
      if (response.data.liked && isDisliked) {
        setIsDisliked(false);
        setVideoDislikes(Math.max(0, videoDislikes - 1));
      }
    } catch (error) {
      toast.error("Failed to like");
    }
  }

  // Handle dislike
  async function handleDislike() {
    if (!user?.user) {
      toast.error("Please login to dislike");
      return;
    }
    try {
      const response = await axios.post(
        `${baseURL}/api/videos/${currentVideo._id}/dislike`,
        {},
        { withCredentials: true }
      );
      setVideoDislikes(response.data.video.dislikes);
      setIsDisliked(response.data.disliked);
      if (response.data.disliked && isLiked) {
        setIsLiked(false);
        setVideoLikes(Math.max(0, videoLikes - 1));
      }
    } catch (error) {
      toast.error("Failed to dislike");
    }
  }

  if (!currentVideo && allShorts.length === 0) {
    return (
      <div className="flex md:mt-17 mt-10 mdd:mt-12">
        <div className="md:w-[20vw] mdd:w-[20vw] h-[100vh]">
          <Sidebar />
        </div>
        <div className="mdd:w-[80vw] md:w-[80vw] w-[100vw] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">No Shorts Available</h2>
            <p className="text-gray-600 mb-4">Upload some shorts to get started!</p>
            <p className="text-sm text-gray-500">Or run: <code className="bg-gray-100 px-2 py-1 rounded">node backend/addShorts.js</code></p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentVideo && allShorts.length > 0) {
    // Still loading
    return (
      <div className="flex md:mt-17 mt-10 mdd:mt-12">
        <div className="md:w-[20vw] mdd:w-[20vw] h-[100vh]">
          <Sidebar />
        </div>
        <div className="mdd:w-[80vw] md:w-[80vw] w-[100vw] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Loading Shorts...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex md:mt-17 mt-10 mdd:mt-12" onWheel={handleWheel}>
      <div className="md:w-[20vw] mdd:w-[20vw] h-[100vh]">
        <Sidebar />
      </div>
      <div className="mdd:w-[80vw] md:w-[80vw] w-[100vw] flex justify-center items-center bg-black">
        <div className="relative w-full max-w-md h-[100vh] flex items-center justify-center">
          {/* Video Player */}
          <div className="relative w-full aspect-[9/16] max-h-[90vh] bg-black rounded-lg overflow-hidden">
            {currentVideo?.videoUrl ? (
              currentVideo.videoUrl.includes('youtube.com/embed') ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={currentVideo.videoUrl}
                  title={currentVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              ) : (
                <video
                  controls
                  autoPlay
                  className="w-full h-full object-contain rounded-lg"
                  src={currentVideo.videoUrl}
                />
              )
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">Video Not Available</span>
              </div>
            )}

            {/* Video Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                    {currentVideo.title}
                  </h3>
                  <p className="text-gray-300 text-xs mb-2">
                    {currentVideo.channelId?.channelName || currentVideo.uploader?.username}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {currentVideo.views?.toLocaleString() || 0} views
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons (Right Side) */}
          <div className="absolute right-4 bottom-20 flex flex-col gap-4 items-center">
            <button
              onClick={handleLike}
              className="flex flex-col items-center gap-1 text-white"
            >
              {isLiked ? (
                <AiFillLike className="text-2xl text-blue-500" />
              ) : (
                <AiOutlineLike className="text-2xl" />
              )}
              <span className="text-xs">{videoLikes.toLocaleString()}</span>
            </button>

            <button
              onClick={handleDislike}
              className="flex flex-col items-center gap-1 text-white"
            >
              {isDisliked ? (
                <AiFillDislike className="text-2xl text-blue-500" />
              ) : (
                <AiOutlineDislike className="text-2xl" />
              )}
              <span className="text-xs">{videoDislikes.toLocaleString()}</span>
            </button>

            <button className="flex flex-col items-center gap-1 text-white">
              <BsThreeDots className="text-2xl" />
            </button>

            <button className="flex flex-col items-center gap-1 text-white">
              <FaShare className="text-xl" />
            </button>
          </div>

          {/* Navigation Arrows */}
          {currentIndex > 0 && (
            <button
              onClick={() => setCurrentIndex(currentIndex - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full p-2"
            >
              ↑
            </button>
          )}
          {currentIndex < allShorts.length - 1 && (
            <button
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full p-2"
            >
              ↓
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Shorts;

