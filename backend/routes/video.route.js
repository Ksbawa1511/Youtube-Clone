import { cretevideo, deleteVedio, fetchVideos, updateVideo, likeVideo, dislikeVideo, getVideoStatus, addToHistory } from "../controllers/video.controller.js";
import { verifyToken, optionalVerifyToken } from "../middleware/authMiddleware.js";


//routes for videos
export function vedioRoute(app) {
    app.get("/api/videos", fetchVideos);
    app.post("/api/videos",verifyToken, cretevideo);
    app.put("/api/videos/:videoId", updateVideo);
    app.delete("/api/videos/:videoId", deleteVedio);
    app.get("/api/videos/:videoId/status", optionalVerifyToken, getVideoStatus);
    app.post("/api/videos/:videoId/like", verifyToken, likeVideo);
    app.post("/api/videos/:videoId/dislike", verifyToken, dislikeVideo);
    app.post("/api/videos/:videoId/history", optionalVerifyToken, addToHistory);
}