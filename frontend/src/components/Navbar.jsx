import React, { useRef } from "react";
import { LuMenu } from "react-icons/lu";
import logo from "../assets/logo.png";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoMdNotificationsOutline } from "react-icons/io";
import { setAllVideos } from "../redux/userSlice";
import { logout, toggleSidebar } from "../redux/userSlice";

function Navbar() {
  const [userInput, setUserInput] = useState("");
  const [videos, setVideos] = useState([]);
  const [toggle2, setToggle2] = useState(false);
  const sidebarOpen = useSelector((state) => state.user.sidebarOpen);

  //to set all videos in redux
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setAllVideos(videos));
  }, [videos]);
  const user =
    useSelector((state) => state.user.user) ||
    JSON.parse(localStorage.getItem("user"));

  const loginPage = Boolean(user);
  const channelPage = Boolean(user?.user?.channels.length > 0);
  const baseURL =
    window.location.hostname === "localhost"
      ? "http://localhost:5001"
      : "https://your-deployment-url.com";
  //to handle logout
  async function handleLogout() {
    try {
      const result = await axios.post(
        `${baseURL}/api/logout`,
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("user");
      dispatch(logout());
      toast.success("User logout successfully");
      window.location.replace("/");
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
    }
  }

  //to get all videos
  useEffect(() => {
    axios
      .get(`${baseURL}/api/videos`, { withCredentials: true })
      .then((result) => {
        setVideos(result.data.allVideos);
      })
      .catch((err) => {
        console.error("Fetch error:", err.response?.data || err.message);
      });
  }, [toggle2]);

  //to toggle menu
  function handleMenu() {
    dispatch(toggleSidebar());
  }

  //to search
  function handleSearch() {
    if (userInput.trim() === "") {
      setToggle2(!toggle2);
      toast.error("Please enter something to search");
      setVideos(videos);
      console.log(videos);
      return;
    }

    const filteredVideos = videos.filter((video) =>
      video.title.toLowerCase().includes(userInput.toLowerCase())
    );

    if (filteredVideos.length > 0) {
      toast.success("Videos found");
      setVideos(filteredVideos);
    } else {
      toast.error("No videos found");
    }
    setUserInput("");
  }

  const profileInfo = useRef(null);
  //to show profile
  function handleUserAction() {
    profileInfo.current.classList.toggle("showProfile");
  }

  return (
    <>
      <div className="flex fixed z-50 top-0 left-0 right-0 justify-between items-center md:py-2 py-2 md:px-4 mdd:px-4 bg-white border-b border-gray-200">
        <div className="flex  items-center ">
          <div
            onClick={handleMenu}
            className="md:mr-3 block mdd:hidden md:hidden mr-1 cursor-pointer"
          >
            <LuMenu className="md:text-2xl text-xl " />
          </div>
          <div className="cursor-pointer">
            <Link to={"/"}>
              <img src={logo} alt="logo" className=" w-28" />
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center flex-1 max-w-[600px]">
            <input
              type="text"
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              value={userInput}
              placeholder="Search"
              className="outline-none border text-sm py-[6px] md:text-base border-gray-300 md:px-4 px-3 font-normal rounded-l-full w-full shadow-inner focus:border-blue-500"
            />
            <button
              onClick={handleSearch}
              className="bg-gray-100 hover:bg-gray-200 py-[6px] cursor-pointer px-4 md:px-6 rounded-r-full outline-none border border-l-0 border-gray-300"
            >
              <CiSearch className="text-xl" />
            </button>
          </div>
          {loginPage && (
            <button className="p-2 hover:bg-gray-100 rounded-full cursor-pointer hidden md:block">
              <IoMdNotificationsOutline className="text-2xl" />
            </button>
          )}
          <div
            onClick={handleUserAction}
            className="mdd:hidden pl-2 w-12 pr-1 cursor-pointer"
          >
            {!loginPage ? (
              <FaRegCircleUser className="text-[33px]  text-blue-700" />
            ) : (
              user?.user?.avatar && (
              <div className="w-9 h-9 bg-gray-400 overflow-hidden rounded-full">
                  <img
                  src={user.user.avatar}
                  className="w-full h-full text-xs  rounded-full"
                  alt="avatar"
                />
              </div>
              )
            )}
          </div>
        </div>
        <div ref={profileInfo} className="profile flex items-center gap-2">
          {loginPage && (
            <>
              <Link to={"/uploadvideo"} className="hidden md:block">
                <button className="flex items-center gap-2 bg-gray-100 md:py-1.5 py-1 px-3 text-xs md:text-sm rounded-full outline-none border border-gray-300 font-medium cursor-pointer hover:bg-gray-200">
                  <FaUpload className="text-lg" />
                  <span className="hidden lg:inline">Create</span>
                </button>
              </Link>
              {!channelPage ? (
                <Link to="/chennel" className="hidden md:block">
                  <button className="flex items-center gap-2 bg-gray-100 md:py-1.5 py-1 px-3 text-xs md:text-sm rounded-full outline-none border border-gray-300 font-medium cursor-pointer hover:bg-gray-200">
                    Create channel
                  </button>
                </Link>
              ) : (
                <Link to="/viewchannel" className="hidden md:block">
                  <button className="flex items-center gap-2 bg-gray-100 md:py-1.5 py-1 px-3 text-xs md:text-sm rounded-full outline-none border border-gray-300 font-medium cursor-pointer hover:bg-gray-200">
                    Your channel
                  </button>
                </Link>
              )}
              <button
                className="flex items-center gap-2 text-xs md:text-sm px-3 py-1.5 rounded-full outline-none font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={handleLogout}
              >
                <div className="h-8 w-8 bg-gray-400 rounded-full overflow-hidden">
                  <img
                    src={user?.user?.avatar}
                    className="h-full w-full rounded-full object-cover"
                    alt="avatar"
                  />
                </div>
              </button>
            </>
          )}
          {!loginPage && (
            <Link to="/login">
              <button className="flex items-center gap-2 text-xs md:text-sm bg-blue-600 hover:bg-blue-700 md:py-1.5 py-1 px-4 md:px-6 text-white rounded-full outline-none font-medium cursor-pointer transition-colors">
                <FaRegCircleUser className="text-lg hidden md:block" />
                Sign in
              </button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
