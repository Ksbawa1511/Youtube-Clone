import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import { store } from "./redux/store.js";
import { Provider } from "react-redux";
import { Suspense, lazy } from "react";

const App = lazy(() => import("./App.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Chennel = lazy(() => import("./pages/channel.jsx"));
const ViewChannel = lazy(() => import("./pages/ViewChannel.jsx"));
const Home = lazy(() => import("./pages/Home.jsx"));
const UploadVideo = lazy(() => import("./pages/UplodeVideo.jsx"));
const Video = lazy(() => import("./pages/VideoPlayer.jsx"));
const UpdateVideo = lazy(() => import("./pages/UpdateVideo.jsx"));
const UpdateChannel = lazy(() => import("./pages/UpdateChannel.jsx"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="chennel" element={<Chennel />} />
      <Route path="viewchannel" element={<ViewChannel />} />
      <Route path="uploadvideo" element={<UploadVideo />} />
      <Route path="video/:videoId" element={<Video />} />
      <Route path="updatevideo/:channelId" element={<UpdateVideo />} />
      <Route path="updatechannel/:channelId" element={<UpdateChannel />} />
    </Route>
  )
);

function Spinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Suspense fallback={<Spinner />}>
        <RouterProvider router={router} />
      </Suspense>
    </Provider>
  </StrictMode>
);
