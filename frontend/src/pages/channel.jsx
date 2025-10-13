import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "../redux/userSlice";
import { useEffect } from "react";

function Chennel() {
  const [isViewChannel, setIsViewChannel] = useState(true);

  const [channelData, setChennelData] = useState({
    channelName: "",
    description: "",
    channelBanner: "",
  });

  const dispatch = useDispatch();

  console.log(channelData);
  const channelHeading = useRef(null);


  const baseURL =
    window.location.hostname === "localhost"
      ? "http://localhost:5001"
      : "https://your-deployment-url.com";
  //fetch user from backend
  useEffect(() => {
    axios
      .get(`${baseURL}/api/user`, {
        withCredentials: true,
      })
      .then((res) => {
        dispatch(login(res.data));
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
      });
  }, [isViewChannel]);

  // this function will create the channel
  async function handleChannel(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${baseURL}/api/channels`,
        channelData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setIsViewChannel(!isViewChannel);
      await axios.put(
        `${baseURL}/api/user/${response.data.channel._id}`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (channelHeading.current) {
        channelHeading.current.innerText = "Channel created successfully";
        channelHeading.current.style.color = "green";
      }
      toast.success("Channel created successfully");
      setChennelData({ channelName: "", description: "", channelBanner: "" });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Registration failed";
      if (channelHeading.current) {
        channelHeading.current.innerText = errorMessage;
        channelHeading.current.style.color = "red";
      }
      toast.error(errorMessage);
    }
  }

  function handleChannelChange(e) {
    setChennelData({ ...channelData, [e.target.name]: e.target.value });
  }

  return (
    <>
      <div className="md:w-[40vw] w-[90vw] text-xs md:text-base mt-17 p-4 bg-gray-100  rounded-2xl m-auto">
        <h3
          ref={channelHeading}
          className="text-xl md:text-2xl text-black font-bold m-auto text-center mb-2 w-full"
        >
          Fill channel details
        </h3>
        <form
          className="flex flex-col gap-2 p-2.5"
          onSubmit={handleChannel}
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
                Create Channel
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
export default Chennel;
