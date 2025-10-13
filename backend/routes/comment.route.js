import { createComment, deleteComment, fetchComment, fetchCommentByVideoId, updateComment } from "../controllers/comment.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";

//routes for comments
export function commentRoutr(app){
    app.get("/api/comments",fetchComment)
    app.post("/api/comments",verifyToken,createComment)
    app.put("/api/comments/:commentId",updateComment)
    app.delete("/api/comments/:commentId",deleteComment)
    app.get("/api/comments/:videoId",fetchCommentByVideoId)
}