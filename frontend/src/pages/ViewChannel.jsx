import React from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";

function ViewChannel() {
  const [videos, setVideos] = useState([]);
  const userData = JSON.parse(localStorage.getItem("user"));
  const [toggle, setToggle] = useState(false);
  const [channelData, setChannelData] = useState("");

  const baseURL =
    window.location.hostname === "localhost"
      ? "http://localhost:5001"
      : "https://your-deployment-url.com";

  useEffect(() => {
    axios
      .get(
        `${baseURL}/api/channels/${userData?.user?.channels[0]?._id}`,
        {
          withCredentials: true,
        }
      )
      .then((result) => {
        setChannelData(result.data.channel);
      })
      .catch((err) => {
        console.error("Fetch error:", err.response?.data || err.message);
      });
  }, [toggle]);

  //to fetch all videos
  useEffect(() => {
    axios
      .get(`${baseURL}/api/videos`, { withCredentials: true })
      .then((result) => {
        setVideos(result?.data?.allVideos);
      })
      .catch((err) => {
        console.error("Fetch error:", err.response?.data || err.message);
      });
  }, [toggle]);

  //to filter videos
  const filteredVideos = videos.filter(
    (video) => video?.uploader?._id == userData?.user?._id
  );

  function handleDelete(videoId) {
    axios
      .delete(`${baseURL}/api/videos/${videoId}`, {
        withCredentials: true,
      })
      .then((result) => {
        setToggle(!toggle);
        toast.success("Video deleted successfully");
        window.location.href = "/viewchannel";
      })
      .catch((err) => {
        console.error("Fetch error:", err.response?.data || err.message);
      });
  }

  return (
    <>
      <div className="flex md:mt-17 mt-15">
        <div id="sidebar" className="mdd:w-[40vw] md:w-[20vw]  h-[100vh]">
          <Sidebar />
        </div>
        <div id="main" className="md:w-[80vw] m-auto  h-[100vh]">
          <div className="w-full">
            <img
              src={channelData?.channelBanner} // ← Use your uploaded banner URL or host locally
              alt="channel Banner"
              className="w-[97%] bg-gray-300 m-auto h-[90px] mdd:h-[160px] rounded-2xl md:h-[170px] object-fill "
            />
          </div>
          <div className="px-4 py-4 flex md:flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src={userData?.user?.avatar}
              alt="Avatar"
              className="md:w-30 md:h-30 bg-gray-300 h-20 w-20 rounded-full border"
            />
            <div className="flex-1">
              <h1 className="mdd:text-3xl text-2xl font-bold line-clamp-1">
                {channelData?.channelName}{" "}
                <span className="text-black/60">✔</span>
              </h1>
              <p className="text-gray-600 text-sm">
                {channelData?.subscribers} subscribers · {filteredVideos.length}{" "}
                videos
              </p>
              <p className="text-gray-700 mdd:text-sm text-xs max-w-xl mt-1 line-clamp-2">
                {channelData?.description}
              </p>
              <Link to={`/updatechannel/${userData?.user?.channels[0]?._id}`}>
                <button className="mt-2 px-4 py-1 cursor-pointer bg-black text-white rounded font-medium hover:bg-gray-800">
                  Edit Channel
                </button>
              </Link>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-semibold px-4 py-2">Videos</h1>
            <div className="flex flex-wrap justify-center mdd:justify-start gap-2 mdd:ml-2 py-2">
              {filteredVideos.map((video) => (
                <div
                  key={video._id}
                  className="flex flex-col pb-2 shadow-sm rounded-lg"
                >
                  <Link to={`/video/${video._id}`}>
                    <div className=" md:w-65 w-86 items-center p-1 ">
                      <img
                        className="md:w-65 w-86 bg-gray-300 md:h-35 h-45 object-cover rounded-lg mb-2"
                        src={video.thumbnailUrl}
                        alt=""
                      />
                      <h2 className="text-[16px] font-semibold line-clamp-1">
                        {video.title}
                      </h2>
                      <p className="text-[#636262]  text-sm line-clamp-1">
                        {video.description}
                      </p>
                      <p className="text-[#636262] text-sm">
                        {video.views} views ·{" "}
                        {
                          new Date(video.uploadDate)
                            .toLocaleString()
                            .split(",")[0]
                        }
                      </p>
                    </div>
                  </Link>
                  <div className="flex pl-1.5 flex-row gap-3  items-center">
                    <Link to={`/updatevideo/${video._id}`}>
                      <button
                        // onClick={() => handleEdit(video)}
                        className="flex cursor-pointer hover:scale-105  justify-center items-center   text-[blue]"
                      >
                        <FiEdit /> Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(video?._id)}
                      className="flex cursor-pointer hover:scale-105 items-center text-[red]"
                    >
                      <AiOutlineDelete /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewChannel;
