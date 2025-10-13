import { createChannel, deleteChennel, getChannelById, getChannels, updateChannel } from "../controllers/chennel.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";
 
//routes for channels
export default function channelRoute(app) {
    app.get("/api/channels",verifyToken, getChannels);
    app.post("/api/channels",verifyToken,createChannel);
    app.get("/api/channels/:channelId",verifyToken,getChannelById);
    app.put("/api/channels/:channelId",verifyToken, updateChannel);
    app.delete("/api/channels/:channelId", verifyToken,deleteChennel);
}