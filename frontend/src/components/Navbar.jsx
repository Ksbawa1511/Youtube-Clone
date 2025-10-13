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
import { setAllVideos } from "../redux/userSlice";
import { logout } from "../redux/userSlice";

function Navbar() {
  const [userInput, setUserInput] = useState("");
  const [videos, setVideos] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [toggle2, setToggle2] = useState(false);

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
    const menu = document.getElementById("sidebar");
    const main = document.getElementById("main");
    if (!toggle) {
      main.style.width = "100vw";
    } else {
      main.style.width = "80vw";
    }
    setToggle(!toggle);
    menu.classList.toggle("hidden");
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
      <div className="flex fixed z-50 top-0 left-0 right-0 justify-between md:py-3 py-2 md:px-6 mdd:px-4  bg-white">
        <div className="flex  items-center ">
          <div
            onClick={handleMenu}
            className="md:mr-3 hidden mdd:block mr-1 cursor-pointer"
          >
            <LuMenu className="md:text-2xl text-xl " />
          </div>
          <div className="cursor-pointer">
            <Link to={"/"}>
              <img src={logo} alt="logo" className=" w-28" />
            </Link>
          </div>
        </div>
        <div className="flex items-center">
          <input
            type="text"
            onChange={(e) => setUserInput(e.target.value)}
            value={userInput}
            placeholder="Search"
            className="outline-none border text-sm py-[5px] md:text-base border-gray-300 md:p-1.5 mdd:p-[4px] p-0.5 mdd:px-4 md:px-4 px-2 font-semibold rounded-l-3xl w-[50vw] mdd:w-[31vw] md:w-[40vw] "
          />
          <button
            onClick={handleSearch}
            className="bg-gray-100 py-[5px] cursor-pointer mdd:p-0.5 md:p-1.5 p-1 mdd:px-4 px-2 md:px-4 rounded-r-3xl outline-none border border-gray-300"
          >
            <CiSearch className="mdd:text-2xl text-xl " />
          </button>
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
        <div ref={profileInfo} className="profile flex items-center   gap-1.5">
          <Link to={"/uploadvideo"}>
            <button className="flex items-center gap-2 bg-gray-100 md:py-1.5 py-1 px-3 text-xs md:text-base rounded-3xl outline-none border border-gray-300  font-semibold cursor-pointer hover:bg-gray-200">
              <FaUpload /> Video
            </button>
          </Link>
          {!channelPage ? (
            <Link to="/chennel">
              <button className="flex items-center gap-2 bg-gray-100 md:py-1.5 py-1 px-3 text-xs md:text-base rounded-3xl outline-none border border-gray-300  font-semibold cursor-pointer hover:bg-gray-200">
                Create chennel
              </button>
            </Link>
          ) : (
            <Link to="/viewchannel">
              <button className="flex items-center gap-2 bg-gray-100 md:py-1.5 py-1 px-3 text-xs md:text-base rounded-3xl outline-none border border-gray-300  font-semibold cursor-pointer hover:bg-gray-200">
                View chennel
              </button>
            </Link>
          )}
          {!loginPage ? (
            <Link to="/login">
              <button className="flex items-center gap-2 text-xs md:text-base bg-gray-100 md:py-[3px] py-1 px-3 md:px-0 text-blue-700 md:pr-2.5 rounded-3xl outline-none border border-gray-300  font-semibold cursor-pointer hover:bg-gray-200">
                <FaRegCircleUser className="text-3xl hidden md:block text-blue-700" />
                Sign in
              </button>
            </Link>
          ) : (
            <Link to="/">
              <button
                className="flex text-[red] mdd:pr-2.5 md:pr-2.5 text-xs  px-3 md:px-0 mdd:px-0  py-1  mdd:py-0 md:text-base items-center gap-2 bg-gray-100  rounded-3xl outline-none border border-gray-300  font-semibold cursor-pointer hover:bg-gray-200"
                onClick={handleLogout}
              >
                <div className="h-9 w-9 mdd:h-6 bg-gray-400 md:h-9 rounded-full hidden mdd:block">
                  <img
                  src={user.user.avatar}
                  className=" h-full w-full rounded-full text-xs text-blue-700"
                  alt="avatar"
                />
               </div>{" "}
                Log out
              </button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
