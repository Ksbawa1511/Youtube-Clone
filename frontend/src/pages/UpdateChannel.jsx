import React, { useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";

function UpdateChannel() {
  const [isViewChannel, setIsViewChannel] = useState(true);
  const channelId = useParams();
  const [channelData, setChennelData] = useState({
    channelName: "",
    description: "",
    channelBanner: "",
  });

  const baseURL =
    window.location.hostname === "localhost"
      ? "http://localhost:5001"
      : "https://your-deployment-url.com";

  //to update input data
  function handleChannelChange(e) {
    setChennelData({ ...channelData, [e.target.name]: e.target.value });
  }

  //to fetch channel using channel id
  const fetchChannel = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/api/channels/${channelId.channelId}`,
        {
          withCredentials: true,
        }
      );
      setChennelData({
        channelName: response.data.channel.channelName,
        description: response.data.channel.description,
        channelBanner: response.data.channel.channelBanner,
      });
    } catch (error) { }
  };

  useEffect(() => {
    fetchChannel();
  }, []);

  //to update channel
  function handleUpdateChannel(e) {
    e.preventDefault();
    axios
      .put(
        `${baseURL}/api/channels/${channelId.channelId}`,
        {
          channelName: channelData.channelName,
          description: channelData.description,
          channelBanner: channelData.channelBanner,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      .then((response) => {
        setIsViewChannel(!isViewChannel);
        toast.success("Channel updated successfully");
        setChennelData({
          channelName: "",
          description: "",
          channelBanner: "",
        });
      })
      .catch((error) => {
        toast.error("Channel update failed");
      });
  }

  return (
    <>
      <div className="md:w-[40vw] w-[90vw] text-xs md:text-base mt-17 p-4 bg-gray-100  rounded-2xl m-auto">
        <h3 className="text-xl md:text-2xl text-black font-bold m-auto text-center mb-2 w-full">
          Update channel details
        </h3>
        <form
          className="flex flex-col gap-2 p-2.5"
          onSubmit={handleUpdateChannel}
          autoComplete="off"
        >
          <label
            htmlFor="channelName"
            className="text-md font-semibold text-gray-700"
          >
            Channel Name
          </label>
          <input
            type="text"
            className="outline-none border border-gray-500 px-2.5 py-1 rounded-md font-semibold"
            id="channelName"
            name="channelName"
            value={channelData.channelName}
            onChange={handleChannelChange}
            placeholder="Enter your Channel Name"
            required
          />
          <label
            htmlFor="description"
            className="text-md font-semibold text-gray-700"
          >
            Channel Description
          </label>
          <input
            type="text"
            className="outline-none border border-gray-500 px-2.5 py-1 rounded-md font-semibold"
            id="text"
            name="description"
            value={channelData.description}
            onChange={handleChannelChange}
            placeholder="Enter your channel description"
            required
          />
          <label
            htmlFor="channelBanner"
            className="text-md font-semibold text-gray-700"
          >
            Channel Banner image
          </label>
          <input
            type="text"
            className="outline-none border border-gray-500 px-2.5 py-1 rounded-md font-semibold"
            id="channelBanner"
            name="channelBanner"
            value={channelData.channelBanner}
            onChange={handleChannelChange}
            placeholder="Enter your banner image URL"
            required
          />

          <div className="flex justify-center gap-2 items-center">
            {isViewChannel ? (
              <button
                type="submit"
                className="text-white w-64 py-1 bg-green-700 cursor-pointer mt-2.5 rounded-md outline-none border border-gray-300 hover:bg-green-600"
              >
                Update Channel
              </button>
            ) : (
              <Link
                to="/viewchannel"
                className="inline-block text-white w-64 text-center py-1 bg-green-700 cursor-pointer mt-2.5 rounded-md outline-none border border-gray-300 hover:bg-green-600"
              >
                View Channel
              </Link>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
export default UpdateChannel;
