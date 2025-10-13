import React, { useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function UpdateVideo() {
  const user = JSON.parse(localStorage.getItem("user"));

  const categories = [
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

  const [videoData, setVideoData] = useState({
    title: "",
    thumbnailUrl: "",
    videoUrl: "",
    description: "",
    category: "",
    channelId: user?.user?.channels[0]?._id,
  });

  const headingRef = useRef(null);
  const channelId = useParams();
  const videoId = channelId.channelId;

  const videos = useSelector((state) => state.user.userInput || []);
  const video = videos.find((video) => video._id === videoId);

  const baseURL =
    window.location.hostname === "localhost"
      ? "http://localhost:5001"
      : "https://your-deployment-url.com";

  useEffect(() => {
    if (video) {
      setVideoData({
        title: video.title,
        thumbnailUrl: video.thumbnailUrl,
        videoUrl: video.videoUrl,
        description: video.description,
        category: video.category,
      });
    }
  }, []);



  //to update video
  function handleUpdate(e) {
    e.preventDefault();
    try {
      axios
        .put(`${baseURL}/api/videos/${videoId}`, videoData, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        })
        .then((res) => {
          toast.success("Video updated successfully");
          window.location.href = "/viewchannel";
        });
    } catch (error) {
      toast.error("Video update failed");
    }
  }

  function handleChange(e) {
    setVideoData({ ...videoData, [e.target.name]: e.target.value });
  }

  return (
    <div className="md:w-[40vw] text-xs md:text-base w-[90vw] mt-16 p-4 bg-gray-100 rounded-2xl m-auto">
      <h3
        ref={headingRef}
        className="md:text-2xl text-xl text-black font-bold text-center mb-4"
      >
        Update Video Details
      </h3>
      <form
        onSubmit={handleUpdate}
        className="flex flex-col gap-2.5"
        autoComplete="off"
      >
        <label htmlFor="title" className="font-semibold text-gray-700">
          Video Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="outline-none border border-gray-500 px-2.5 py-1 rounded-md"
          value={videoData.title}
          onChange={handleChange}
          placeholder="Enter video title"
          required
        />

        <label htmlFor="thumbnailUrl" className="font-semibold text-gray-700">
          Thumbnail URL
        </label>
        <input
          type="text"
          id="thumbnailUrl"
          name="thumbnailUrl"
          className="outline-none border border-gray-500 px-2.5 py-1 rounded-md"
          value={videoData.thumbnailUrl}
          onChange={handleChange}
          placeholder="Enter thumbnail URL"
          required
        />

        <label htmlFor="videoUrl" className="font-semibold text-gray-700">
          Video URL
        </label>
        <input
          type="text"
          id="videoUrl"
          name="videoUrl"
          className="outline-none border border-gray-500 px-2.5 py-1 rounded-md"
          value={videoData.videoUrl}
          onChange={handleChange}
          placeholder="Enter video URL"
          required
        />

        <label htmlFor="description" className="font-semibold text-gray-700">
          Description
        </label>
        <input
          type="text"
          id="description"
          name="description"
          className="outline-none border border-gray-500 px-2.5 py-1 rounded-md"
          value={videoData.description}
          onChange={handleChange}
          placeholder="Enter video description"
          required
        />

        <label htmlFor="category" className="font-semibold text-gray-700">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={videoData.category}
          onChange={handleChange}
          className="outline-none border border-gray-500 px-2.5 py-1 rounded-md bg-white text-gray-800"
          required
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="text-white w-64 py-1 bg-blue-700 cursor-pointer mt-3 mx-auto rounded-md hover:bg-blue-600"
        >
          Update Video
        </button>
      </form>
    </div>
  );
}

export default UpdateVideo;
