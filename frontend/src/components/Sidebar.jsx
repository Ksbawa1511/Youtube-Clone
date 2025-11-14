import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSidebarOpen, setAllVideos } from "../redux/userSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { GoHome } from "react-icons/go";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions, MdHistory } from "react-icons/md";
import { PiUserSquareThin } from "react-icons/pi";
import { IoGameControllerOutline } from "react-icons/io5";
import { AiOutlineLike } from "react-icons/ai";
import { FaChevronRight } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import { SiYoutubestudio } from "react-icons/si";
import { SiYoutubekids } from "react-icons/si";
import { MdOutlineWatchLater } from "react-icons/md";
import { SiYoutubemusic } from "react-icons/si";
import { SiTrendmicro } from "react-icons/si";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { PiFilmSlateLight } from "react-icons/pi";
import { CgMediaLive } from "react-icons/cg";
import { FaRegNewspaper } from "react-icons/fa";
import { TfiCup } from "react-icons/tfi";
import { PiLightbulbLight } from "react-icons/pi";
import { SiStylelint } from "react-icons/si";
import { MdPodcasts } from "react-icons/md";
import { BiVideo } from "react-icons/bi";
import { IoSettingsOutline } from "react-icons/io5";
import { FiFlag } from "react-icons/fi";
import { BsQuestionCircle } from "react-icons/bs";
import { MdOutlineFeedback } from "react-icons/md";

function Sidebar() {
  const sidebarOpen = useSelector((state) => state.user.sidebarOpen);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user.user) || (localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null);
  
  // Check if current path matches
  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };
  
  const baseURL =
    window.location.hostname === "localhost"
      ? "http://localhost:5001"
      : "https://your-deployment-url.com";

  // Handle category filter
  const handleCategoryFilter = async (categoryName) => {
    try {
      const { filterAvailableVideos } = await import("../utils/videoUtils");
      const response = await axios.get(`${baseURL}/api/videos`, { withCredentials: true });
      const allVideos = response.data.allVideos || [];
      const availableVideos = filterAvailableVideos(allVideos);
      
      let filteredVideos = [];
      if (categoryName === "Trending") {
        // Sort by views (most popular)
        filteredVideos = [...availableVideos].sort((a, b) => (b.views || 0) - (a.views || 0));
      } else {
        // Map category names to database categories
        const categoryMap = {
          "Music": "Music",
          "Gaming": "Gaming",
          "News": "News",
          "Sport": "Sports",
          "Films": "Movies",
          "Fashion & beauty": "Entertainment", // Default mapping
          "Courses": "Education",
          "Padcasts": "Entertainment", // Default mapping
          "Shopping": "Entertainment", // Default mapping
          "Live": "Entertainment" // Default mapping
        };
        const dbCategory = categoryMap[categoryName] || categoryName;
        filteredVideos = availableVideos.filter(video => video.category === dbCategory);
      }
      
      dispatch(setAllVideos(filteredVideos));
      navigate("/");
      dispatch(setSidebarOpen(false));
      toast.success(`${categoryName} videos loaded`);
    } catch (error) {
      console.error("Error filtering videos:", error);
      toast.error("Failed to load videos");
    }
  };

  // Handle "Your Channel" click
  const handleYourChannel = () => {
    if (!user?.user) {
      toast.error("Please login to view your channel");
      navigate("/login");
      return;
    }
    if (user.user.channels && user.user.channels.length > 0) {
      const channelId = user.user.channels[0]._id || user.user.channels[0];
      navigate(`/channel/${channelId}`);
    } else {
      navigate("/chennel");
      toast.info("Create a channel first");
    }
    dispatch(setSidebarOpen(false));
  };

  // Handle "Your Videos" click
  const handleYourVideos = () => {
    if (!user?.user) {
      toast.error("Please login to view your videos");
      navigate("/login");
      return;
    }
    if (user.user.channels && user.user.channels.length > 0) {
      const channelId = user.user.channels[0]._id || user.user.channels[0];
      navigate(`/channel/${channelId}`);
    } else {
      navigate("/chennel");
      toast.info("Create a channel first");
    }
    dispatch(setSidebarOpen(false));
  };

  // Handle placeholder features
  const handlePlaceholder = (featureName) => {
    toast.info(`${featureName} feature coming soon!`);
    dispatch(setSidebarOpen(false));
  };
  
      const sidebarItems = [
        {
          id: 2,
          name: "Shorts",
          icon: <SiYoutubeshorts />,
          link: "/shorts",
        },
    {
      id: 3,
      name: "Subscriptions",
      icon: <MdOutlineSubscriptions />,
      link: "/subscriptions",
    },
  ];
  const sidebarItems2 = [
    {
      id: 1,
      name: "Your Channel",
      icon: <PiUserSquareThin />,
      onClick: handleYourChannel,
    },
    {
      id: 2,
      name: "History",
      icon: <MdHistory />,
      link: "/history",
    },
    {
      id: 3,
      name: "Playlists",
      icon: <MdOutlineSubscriptions />,
      onClick: () => handlePlaceholder("Playlists"),
    },
    {
      id: 4,
      name: "Your Videos",
      icon: <BiVideo />,
      onClick: handleYourVideos,
    },
    {
      id: 5,
      name: "Watch later",
      icon: <MdOutlineWatchLater />,
      onClick: () => handlePlaceholder("Watch later"),
    },
    {
      id: 6,
      name: "Liked videos",
      icon: <AiOutlineLike />,
      link: "/liked-videos",
    },
  ];
  const sidebarItems3 = [
    {
      id: 1,
      name: "Trending",
      icon: <SiTrendmicro />,
      onClick: () => handleCategoryFilter("Trending"),
    },
    {
      id: 2,
      name: "Shopping",
      icon: <HiOutlineShoppingBag />,
      onClick: () => handleCategoryFilter("Shopping"),
    },
    {
      id: 3,
      name: "Music",
      icon: <SiYoutubemusic />,
      onClick: () => handleCategoryFilter("Music"),
    },
    {
      id: 4,
      name: "Films",
      icon: <PiFilmSlateLight />,
      onClick: () => handleCategoryFilter("Films"),
    },
    {
      id: 5,
      name: "Live",
      icon: <CgMediaLive />,
      onClick: () => handleCategoryFilter("Live"),
    },
    {
      id: 6,
      name: "Gaming",
      icon: <IoGameControllerOutline />,
      onClick: () => handleCategoryFilter("Gaming"),
    },
    {
      id: 7,
      name: "News",
      icon: <FaRegNewspaper />,
      onClick: () => handleCategoryFilter("News"),
    },
    {
      id: 8,
      name: "Sport",
      icon: <TfiCup />,
      onClick: () => handleCategoryFilter("Sport"),
    },
    {
      id: 9,
      name: "Courses",
      icon: <SiStylelint />,
      onClick: () => handleCategoryFilter("Courses"),
    },
    {
      id: 10,
      name: "Fashion & beauty",
      icon: <PiLightbulbLight />,
      onClick: () => handleCategoryFilter("Fashion & beauty"),
    },
    {
      id: 11,
      name: "Padcasts",
      icon: <MdPodcasts />,
      onClick: () => handleCategoryFilter("Padcasts"),
    },
  ];
  const sidebarItems4 = [
    {
      id: 1,
      name: "Youtube Premium",
      icon: <FaYoutube />,
      onClick: () => handlePlaceholder("YouTube Premium"),
    },
    {
      id: 2,
      name: "Youtube Studio",
      icon: <SiYoutubestudio />,
      onClick: () => handlePlaceholder("YouTube Studio"),
    },
    {
      id: 3,
      name: "Youtube Music",
      icon: <SiYoutubemusic />,
      onClick: () => handlePlaceholder("YouTube Music"),
    },
    {
      id: 4,
      name: "Youtube Kids",
      icon: <SiYoutubekids />,
      onClick: () => handlePlaceholder("YouTube Kids"),
    },
  ];
  const sidebarItems5 = [
    {
      id: 1,
      name: "Settings",
      icon: <IoSettingsOutline />,
      onClick: () => handlePlaceholder("Settings"),
    },
    {
      id: 2,
      name: "Report history",
      icon: <FiFlag />,
      onClick: () => handlePlaceholder("Report history"),
    },
    {
      id: 3,
      name: "Help",
      icon: <BsQuestionCircle />,
      onClick: () => handlePlaceholder("Help"),
    },
    {
      id: 4,
      name: "Send feedback",
      icon: <MdOutlineFeedback />,
      onClick: () => handlePlaceholder("Send feedback"),
    },
  ];
  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 mdd:hidden md:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}
      <div
        className={`myscrolbar fixed left-0 md:left-[0px] md:px-3 px-2 h-[100vh] overflow-y-scroll hide-scrollbar overflow-x-hidden bg-white z-50 transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0 w-[240px]"
            : "-translate-x-full mdd:translate-x-0 md:translate-x-0"
        } mdd:block md:block`}
      >
      {/* Home */}
      <Link to="/" onClick={() => dispatch(setSidebarOpen(false))}>
        <div className={`flex items-center gap-4 hover:bg-gray-100 rounded-lg px-3 py-2.5 mb-1 transition-colors ${
          isActive("/") && location.pathname === "/" ? "bg-gray-100 font-medium" : ""
        }`}>
          <div className="text-[22px] flex items-center justify-center w-6">
            <GoHome />
          </div>
          <span className="text-sm leading-5">Home</span>
        </div>
      </Link>
      <div className="space-y-0.5">
        {sidebarItems.map((item) => {
          const active = isActive(item.link);
          const content = (
            <div
              className={`flex items-center gap-4 hover:bg-gray-100 rounded-lg px-3 py-2.5 transition-colors ${
                active ? "bg-gray-100 font-medium" : ""
              }`}
            >
              <div className="text-[22px] flex items-center justify-center w-6">{item.icon}</div>
              <span className="text-sm leading-5">{item.name}</span>
            </div>
          );
          return item.link ? (
            <Link 
              to={item.link} 
              key={item.id} 
              className="block no-underline"
              onClick={() => dispatch(setSidebarOpen(false))}
            >
              {content}
            </Link>
          ) : (
            <div key={item.id}>{content}</div>
          );
        })}
      </div>
      <div className="my-2">
        <hr className="border-gray-200" />
      </div>
      {/* You */}
      <div className="mt-2 mb-2">
        <div className="flex items-center px-3 py-2">
          <h1 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">You</h1>
        </div>
        <div className="space-y-0.5">
          {sidebarItems2.map((item) => {
            const active = item.link ? isActive(item.link) : false;
            const content = (
              <div
                className={`flex items-center gap-4 hover:bg-gray-100 rounded-lg px-3 py-2.5 transition-colors ${
                  active ? "bg-gray-100 font-medium" : ""
                }`}
              >
                <div className="text-[22px] flex items-center justify-center w-6">{item.icon}</div>
                <span className="text-sm leading-5">{item.name}</span>
              </div>
            );
            if (item.link) {
              return (
                <Link 
                  to={item.link} 
                  key={item.id} 
                  className="block no-underline"
                  onClick={() => dispatch(setSidebarOpen(false))}
                >
                  {content}
                </Link>
              );
            } else if (item.onClick) {
              return (
                <div key={item.id} onClick={item.onClick} className="cursor-pointer">
                  {content}
                </div>
              );
            } else {
              return <div key={item.id}>{content}</div>;
            }
          })}
        </div>
      </div>
      <div className="my-2">
        <hr className="border-gray-200" />
      </div>
      {/* Explore */}
      <div className="mt-2 mb-2">
        <div className="flex items-center px-3 py-2">
          <h1 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Explore</h1>
        </div>
        <div className="space-y-0.5">
          {sidebarItems3.map((item) => {
            return (
              <div
                key={item.id}
                onClick={item.onClick}
                className="flex items-center gap-4 hover:bg-gray-100 rounded-lg px-3 py-2.5 cursor-pointer transition-colors"
              >
                <div className="text-[22px] flex items-center justify-center w-6">{item.icon}</div>
                <span className="text-sm leading-5">{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="my-2">
        <hr className="border-gray-200" />
      </div>
      {/* More section */}
      <div className="mt-2 mb-2">
        <div className="flex items-center px-3 py-2">
          <h1 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">More From Youtube</h1>
        </div>
        <div className="space-y-0.5">
          {sidebarItems4.map((item) => {
            return (
              <div
                key={item.id}
                onClick={item.onClick}
                className="flex items-center gap-4 hover:bg-gray-100 rounded-lg px-3 py-2.5 cursor-pointer transition-colors"
              >
                <div className="text-[22px] flex items-center justify-center w-6 text-red-600">
                  {item.icon}
                </div>
                <span className="text-sm leading-5">{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="my-2">
        <hr className="border-gray-200" />
      </div>

      <div className="mt-2 mb-2 space-y-0.5">
        {sidebarItems5.map((item) => {
          return (
            <div
              key={item.id}
              onClick={item.onClick}
              className="flex items-center gap-4 hover:bg-gray-100 rounded-lg px-3 py-2.5 cursor-pointer transition-colors"
            >
              <div className="text-[22px] flex items-center justify-center w-6">{item.icon}</div>
              <span className="text-sm leading-5">{item.name}</span>
            </div>
          );
        })}
      </div>

      <div className="my-2">
        <hr className="border-gray-200" />
      </div>
      <div className="px-3 py-3 space-y-2">
        <div className="text-[11px] text-gray-500 leading-relaxed">
          <div>About Press Copyright</div>
          <div>Contact us Creators</div>
          <div>Advertise Developers</div>
          <div className="mt-2">Terms Privacy Policy & Safety</div>
          <div>How YouTube works</div>
          <div>Test new features</div>
        </div>
        <div className="text-[11px] text-gray-500 pt-2">
          © 2025 Developed By Kaushal Singh
        </div>
      </div>
    </div>
    </>
  );
}

export default Sidebar;
