import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllVideos } from "../redux/userSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { filterAvailableVideos } from "../utils/videoUtils";

function ListItems() {
  const [videos, setVideos] = useState([]);
  const [toggle2, setToggle2] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const dispatch = useDispatch();
  const baseURL =
    window.location.hostname === "localhost"
      ? "http://localhost:5001"
      : "https://your-deployment-url.com";
  //to fetch all videos
  useEffect(() => {
    axios
      .get(`${baseURL}/api/videos`, { withCredentials: true })
      .then((result) => {
        const allVideos = result.data.allVideos || [];
        // Filter only videos without videoUrl (keep all others)
        const availableVideos = allVideos.filter(video => {
          if (!video || !video.videoUrl || typeof video.videoUrl !== 'string' || video.videoUrl.trim() === '') {
            return false;
          }
          return true;
        });
        // If no videos after filtering, use all videos (filter might be too strict)
        const videosToUse = availableVideos.length > 0 ? availableVideos : allVideos;
        setVideos(videosToUse);
        dispatch(setAllVideos(videosToUse)); // Dispatch to Redux
      })
      .catch((err) => {
        console.error("Fetch error:", err.response?.data || err.message);
      });
  }, [toggle2, dispatch]);

  const categories = [
    "All",
    "Shorts",
    "Education",
    "Entertainment",
    "Music",
    "Gaming",
    "Sports",
    "Technology",
    "News",
    "Travel",
    "Movies",
    "anime",
    "series",
  ];

  //to filter videos
  function handleFilter(category) {
    setSelectedCategory(category);
    if (category === "All") {
      dispatch(setAllVideos(videos));
      return;
    }
    if (category === "Shorts") {
      const shortsVideos = videos.filter(
        (video) => video.isShort === true || video.category === "Shorts"
      );
      if (shortsVideos.length > 0) {
        dispatch(setAllVideos(shortsVideos));
      } else {
        toast.error("No shorts found");
        dispatch(setAllVideos(videos));
      }
      return;
    }
    const filteredVideos = videos.filter(
      (video) => video.category === category
    );

    if (filteredVideos.length > 0) {
      dispatch(setAllVideos(filteredVideos));
    } else {
      toast.error("No videos found for this category");
      setToggle2((prev) => !prev);
      dispatch(setAllVideos(videos));
    }
  }

  return (
    <div
      id="main"
      className="myscrolbar flex sticky z-10 md:w-[100%] xsm:w-[100vw] top-14 mdd:top-14 md:top-16 bg-white right-0 overflow-x-scroll hide-scroll-bar px-4 py-2"
    >
      <div className="flex space-x-2 py-1 flex-nowrap">
        {categories.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              onClick={() => {
                handleFilter(category);
              }}
              key={category}
              className={`flex-none whitespace-nowrap text-sm md:text-sm rounded-full px-4 py-1.5 font-medium cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-gray-100 text-black hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ListItems;
