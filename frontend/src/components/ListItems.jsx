import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllVideos } from "../redux/userSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

function ListItems() {
  const [videos, setVideos] = useState([]);
  const [toggle2, setToggle2] = useState(false);
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
        setVideos(result.data.allVideos);
        dispatch(setAllVideos(result.data.allVideos)); // Dispatch to Redux
      })
      .catch((err) => {
        console.error("Fetch error:", err.response?.data || err.message);
      });
  }, [toggle2, dispatch]);

  const categories = [
    "All",
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
    if (category === "All") {
      dispatch(setAllVideos(videos));
      return;
    }
    const filteredVideos = videos.filter(
      (video) => video.category === category
    );

    if (filteredVideos.length > 0) {
      toast.success("Videos found for this category");
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
      className="myscrolbar  flex sticky z-5 md:w-[100%] xsm:w-[100vw] top-11 mdd:top-11 md:top-15  bg-white right-0 overflow-x-scroll hide-scroll-bar px-1"
    >
      <div className="flex space-x-3 py-0.5 flex-nowrap">
        {categories.map((category) => {
          return (
            <div
              onClick={() => {
                handleFilter(category);
              }}
              key={category}
              className=" flex-none bg-gray-100 hover:bg-gray-300 duration-300 text-sm md:text-base rounded-xl px-4 py-1.5 font-semibold text-black cursor-pointer"
            >
              {category}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ListItems;
