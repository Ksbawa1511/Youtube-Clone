import { cretevideo, deleteVedio, fetchVideos, updateVideo } from "../controllers/video.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";


//routes for videos
export function vedioRoute(app) {
    app.get("/api/videos", fetchVideos);
    app.post("/api/videos",verifyToken, cretevideo);
    app.put("/api/videos/:videoId", updateVideo);
    app.delete("/api/videos/:videoId", deleteVedio);
}